"use server";
import { format } from "date-fns";
import { generateId } from "ai";
import { createAI, createStreamableUI, createStreamableValue } from "ai/rsc";
import { OpenAI } from "openai";
import { ReactNode } from "react";
import { getWeatherReport } from "./getWeather";
import { Message } from "./message";
import { searchEmails } from "./searchEmails";
import { getUserId } from "./getUserId";
import { UserID } from "./components/UserId";
import {
  getNCancelledRides,
  getNRides,
  getTopNEarners,
  getFilteredDriver,
} from "./lib/functions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ClientMessage {
  id: string;
  status: ReactNode;
  text: ReactNode;
  gui: ReactNode;
}

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_KEY as string;
let THREAD_ID = "";
let RUN_ID = "";

export async function submitMessage(question: string): Promise<ClientMessage> {
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const systemMessage = `{"role": "user", "content": {"currentDate": "${currentDate}"}}`;
  const status = createStreamableUI("thread.init");
  const textStream = createStreamableValue("");
  const textUIStream = createStreamableUI(
    <Message textStream={textStream.value} />
  );
  const gui = createStreamableUI();

  const runQueue = [];

  (async () => {
    const userMessage = `json: ${question}`;
    if (THREAD_ID) {
      await openai.beta.threads.messages.create(THREAD_ID, {
        role: "user",
        content: userMessage,
      });
      await openai.beta.threads.messages.create(THREAD_ID, {
        role: "user",
        content: systemMessage,
      });

      const run = await openai.beta.threads.runs.create(THREAD_ID, {
        assistant_id: ASSISTANT_ID,
        response_format: { type: "text" },

        stream: true,
      });

      runQueue.push({ id: generateId(), run });
    } else {
      const run = await openai.beta.threads.createAndRun({
        assistant_id: ASSISTANT_ID,
        response_format: { type: "text" },
        stream: true,
        thread: {
          messages: [
            { role: "user", content: userMessage },
            { role: "user", content: systemMessage },
          ],
        },
      });

      runQueue.push({ id: generateId(), run });
    }

    while (runQueue.length > 0) {
      const latestRun = runQueue.shift();

      if (latestRun) {
        for await (const delta of latestRun.run) {
          const { data, event } = delta;
          console.log("Event:", event); // Debugging log
          status.update(event);

          if (event === "thread.created") {
            THREAD_ID = data.id;
          } else if (event === "thread.run.created") {
            RUN_ID = data.id;
          } else if (event === "thread.message.delta") {
            data.delta.content?.map((part: any) => {
              if (part.type === "text") {
                if (part.text) {
                  textStream.update(part.text.value);
                }
              }
            });
          } else if (event === "thread.run.requires_action") {
            console.log("F");
            if (data.required_action) {
              if (data.required_action.type === "submit_tool_outputs") {
                const { tool_calls } = data.required_action.submit_tool_outputs;
                const tool_outputs = [];

                for (const tool_call of tool_calls) {
                  const { id: toolCallId, function: fn } = tool_call;
                  const { name, arguments: args } = fn;

                  if (name === "search_emails") {
                    const { query, has_attachments } = JSON.parse(args);

                    gui.update(
                      <div className="flex flex-row gap-2 items-center">
                        <div>
                          Searching for emails: {query}, has_attachments:
                          {has_attachments ? "true" : "false"}
                        </div>
                      </div>
                    );

                    await new Promise((resolve) => setTimeout(resolve, 2000));

                    const fakeEmails = searchEmails({ query, has_attachments });

                    gui.update(
                      <div className="flex flex-col gap-2">
                        {fakeEmails.map((email) => (
                          <div
                            key={email.id}
                            className="p-2 bg-zinc-100 rounded-md flex flex-row gap-2 items-center justify-between"
                          >
                            <div className="flex flex-row gap-2 items-center">
                              <div>{email.subject}</div>
                            </div>
                            <div className="text-zinc-500">{email.date}</div>
                          </div>
                        ))}
                      </div>
                    );

                    tool_outputs.push({
                      tool_call_id: toolCallId,
                      output: JSON.stringify(fakeEmails),
                    });
                  } else if (name === "get_weather") {
                    const location = JSON.parse(args) as string;

                    gui.update(
                      <div className="flex flex-row gap-2 items-center">
                        <div>Searching for weather: {location},</div>
                      </div>
                    );

                    await new Promise((resolve) => setTimeout(resolve, 2000));

                    const weather = getWeatherReport(location);

                    gui.update(
                      <div className="flex flex-col gap-2">{weather}</div>
                    );

                    tool_outputs.push({
                      tool_call_id: toolCallId,
                      output: JSON.stringify(weather),
                    });
                  } else if (name === "get_user_id") {
                    const { query, type } = JSON.parse(args);
                    const userId = await getUserId({ query, type });
                    gui.update(<UserID userId={userId} />);
                    tool_outputs.push({
                      tool_call_id: toolCallId,
                      output: JSON.stringify(userId),
                    });
                  } else if (name === "get_database_statistics") {
                    const { entity, criteria } = JSON.parse(args);

                    let statistics;

                    switch (entity) {
                      case "top_rides":
                        statistics = await getNRides(criteria);
                        break;
                      case "top_earners":
                        statistics = await getTopNEarners(criteria);
                        break;
                      case "cancelled_rides":
                        statistics = await getNCancelledRides(criteria);
                        break;
                      case "drivers":
                        statistics = await getFilteredDriver(criteria);
                        break;
                      default:
                        statistics = { error: "Unknown entity" };
                    }

                    tool_outputs.push({
                      tool_call_id: toolCallId,
                      output: JSON.stringify(statistics),
                    });
                  } else if (name === "get_info") {
                    const { action, params } = JSON.parse(args);
                    let info;
                    switch (action) {
                      case "is_number_blocked":
                        info = await getNRides(params); //TODO: change this
                        break;
                      case "get_base_fare":
                        info = await getTopNEarners(params); //TODO: change this
                        break;
                      case "get_ids":
                        info = await getNCancelledRides(params); //TODO: change this
                        break;
                      case "get_details":
                        info = await getFilteredDriver(params); //TODO: change this
                        break;
                      default:
                        info = { error: "Unknown action" };
                    }
                  }
                }

                const nextRun: any =
                  await openai.beta.threads.runs.submitToolOutputs(
                    THREAD_ID,
                    RUN_ID,
                    {
                      tool_outputs,
                      stream: true,
                    }
                  );

                runQueue.push({ id: generateId(), run: nextRun });
              }
            }
          } else if (event === "thread.run.failed") {
            console.log(data);
          }
        }
      }
    }

    status.done();
    textUIStream.done();
    gui.done();
  })();

  return {
    id: generateId(),
    status: status.value,
    text: textUIStream.value,
    gui: gui.value,
  };
}

export const AI = createAI({
  actions: { submitMessage },
});

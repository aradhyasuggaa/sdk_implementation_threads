"use server";

export async function getTopNEarners(input: {
  num_records: number;
  start_date: Date;
  end_date: Date;
}) {
  console.log("In TOP N EARNERS:", input);
  const n = input.num_records ?? 3;
  const startDate = input.start_date ?? new Date("2024-03-18");
  const endDate = input.end_date ?? new Date();
  console.log(input.num_records, input.start_date, input.end_date);
  console.log(n, startDate, endDate);

  return true;
}

export async function getNRides({
  num_records = 3,
  role = "saathi",
  startDate = new Date("2024-03-18"),
  endDate = new Date(),
}: {
  num_records: number;
  role: string;
  startDate: Date;
  endDate: Date;
}) {
  console.log("In GET N RIDES");
  console.log(num_records, role, startDate, endDate);
  return true;
}

export async function getFilteredDriver({
  num_records = 3,
  startDate = new Date("2024-03-18"),
  endDate = new Date(),
  gender_pronoun = "he",
}: {
  num_records: number;
  gender_pronoun: string;
  startDate: Date;
  endDate: Date;
}) {
  console.log("In GET FILTERED DRIVER");
  console.log(num_records, startDate, endDate, gender_pronoun);
  return true;
}

export async function getNCancelledRides({
  num_records = 3,
  role = "saathi",
  startDate = new Date("2024-03-18"),
  endDate = new Date(),
}: {
  num_records: number;
  role: string;
  startDate: Date;
  endDate: Date;
}) {
  console.log("In GET N CANCELLED RIDES");
  console.log(num_records, role, startDate, endDate);
  return true;
}

export async function getNTopRefererrs({
  num_records = 3,
  role = "rider",
  startDate = new Date("2024-03-18"),
  endDate = new Date(),
}: {
  num_records: number;
  role: string;
  startDate: Date;
  endDate: Date;
}) {
  console.log("In GET N TOP REFERRERS");
  console.log(num_records, role, startDate, endDate);
  return true;
}

export async function getNActiveDrivers({
  num_records = 3,
  role = "saathi",
  startDate = new Date("2024-03-18"),
  endDate = new Date(),
}: {
  num_records: number;
  role: string;
  startDate: Date;
  endDate: Date;
}) {
  console.log("In GET N ACTIVE DRIVERS");
  console.log(num_records, startDate, endDate, role);
  return true;
}
export async function isNumberBlocked(input: { phone_number: string }) {
  console.log("In IS NUMBER BLOCKED");
  console.log(input.phone_number);
  return true;
}

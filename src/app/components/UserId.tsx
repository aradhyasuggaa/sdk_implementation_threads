"use client";

import React from "react";
import { getUserId } from "@/app/getUserId";

export const UserID = ({ userId }: { userId: string }) => {
  return (
    <div className="bg-neutral-100 p-4 rounded-md m-4 max-w-prose flex items-center justify-between">
      <p>{userId}</p>
    </div>
  );
};
export default UserID;

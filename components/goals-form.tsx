"use client";

import { useState } from "react";
import { submitGoals } from "@/actions/actions";

type GoalsFormProps = {
  initialApplications: number;
  initialLeetcode: number;
  initialProjectHours: number;
}

export default function GoalsForm({
  initialApplications,
  initialLeetcode,
  initialProjectHours,
}: GoalsFormProps) {
  const [jobs, setJobs] = useState(initialApplications);
  const [leetcode, setLeetcode] = useState(initialLeetcode);
  const [projectHours, setProjectHours] = useState(initialProjectHours);
  return (
    <form className="max-w-175 min-w-full flex flex-col text-center bg-white p-6 rounded-2xl sm:min-w-lg" action={submitGoals}>
      <label htmlFor="job-applications">
        Job Applications: <strong>{jobs}</strong>
      </label>

      <input
        id="job-applications"
        name="job-applications"
        type="range"
        min="0"
        max="20"
        value={jobs}
        onChange={(e) => setJobs(Number(e.target.value))}
        className="mb-2"
      />

      <label htmlFor="leetcode">
        LeetCode Problems: <strong>{leetcode}</strong>
      </label>

      <input
        id="leetcode"
        name="leetcode"
        type="range"
        min="0"
        max="20"
        value={leetcode}
        onChange={(e) => setLeetcode(Number(e.target.value))}
        className="mb-2"
      />

      <label htmlFor="project-hours">
        Project Hours: <strong>{projectHours}</strong>
      </label>

      <input
        id="project-hours"
        name="project-hours"
        type="range"
        min="0"
        max="20"
        value={projectHours}
        onChange={(e) => setProjectHours(Number(e.target.value))}
        className="mb-4"
      />

      <button className="bg-blue-400 rounded-sm py-2 hover:bg-blue-500 text-white cursor-pointer" type="submit">Submit</button>
    </form>
  );
}
"use client";
import { submitEntry } from "@/actions/actions";
import { useState } from "react";

type Goals = {
    applications: number;
    leetcode: number;
    projectHours: number;
  }

export default function EntryForm({ goals }: {  goals: Goals }) {

  const [jobs, setJobs] = useState(goals.applications);
  const [leetcode, setLeetcode] = useState(goals.leetcode);
  const [projectHours, setProjectHours] = useState(goals.projectHours);
  const today = new Date().toLocaleDateString();

  const todayLocal = new Date()
  todayLocal.setHours(0, 0, 0, 0); // local midnight

  return (
    <div className="mb-5 min-w-full sm:min-w-lg">
      <h1 className="font-semibold text-3xl mb-4">Submission for {today}</h1>
      <form className="max-w-175 flex flex-col sm:min-w-100 bg-white p-6 rounded-2xl text-black" action={submitEntry}>
        <input 
          type="hidden" 
          name="client-date"
          value={todayLocal.toISOString()}
        />
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
    </div>
  );
}
"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Printer,
  ChevronDown,
  Coffee,
} from "lucide-react";
import {
  CLASS_OPTIONS,
  GROUP_OPTIONS,
  SECTION_OPTIONS,
  WEEK_DAYS,
  getClassRoutine,
} from "@/data/classRoutineData";

export default function ClassRoutineSection() {
  const [selectedClass, setSelectedClass] = useState<string>("9");
  const [selectedGroup, setSelectedGroup] = useState<string>("Science");
  const [selectedSection, setSelectedSection] = useState<"A" | "B" | "C">("A");
  const [selectedDay, setSelectedDay] = useState<string>("All");

  // Determine if selected class supports groups (Class 9 and 10)
  const isGroupApplicable = useMemo(() => {
    const classNum = parseInt(selectedClass, 10);
    return classNum >= 9;
  }, [selectedClass]);

  // Retrieve matching routine data
  const routineData = useMemo(() => {
    return getClassRoutine(
      selectedClass,
      isGroupApplicable ? selectedGroup : "General",
      selectedSection
    );
  }, [selectedClass, selectedGroup, selectedSection, isGroupApplicable]);

  // Filter days if a specific day is selected
  const displaySchedule = useMemo(() => {
    if (selectedDay === "All") {
      return routineData.schedule;
    }
    return routineData.schedule.filter((d) => d.day === selectedDay);
  }, [routineData, selectedDay]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 font-sans">
      {/* 1. Header & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center gap-3">
            <CalendarDays className="h-8 w-8 sm:h-9 sm:w-9 text-emerald-600" />
            <span>Class Routine</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5">
            View weekly class timetable, period timings, and classroom details.
          </p>
        </div>

      </div>

      {/* 2. Controls Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Class Selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Class</label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm sm:text-base font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition cursor-pointer"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* Group Selector (Conditional) */}
          {isGroupApplicable ? (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Group / Stream</label>
              <div className="relative">
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 py-3 text-sm sm:text-base font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition cursor-pointer"
                >
                  {GROUP_OPTIONS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 opacity-60">
              <label className="text-sm font-bold text-slate-400">Group / Stream</label>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-400">
                General Studies (Class 1–8)
              </div>
            </div>
          )}

          {/* Section Selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Section</label>
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value as "A" | "B" | "C")}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm sm:text-base font-bold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition cursor-pointer"
              >
                {SECTION_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* Class Summary Badge */}
          <div className="space-y-1.5 sm:col-span-3 lg:col-span-1 flex flex-col justify-end">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm flex items-center justify-between text-slate-700">
              <span className="font-semibold text-slate-500">Class Teacher:</span>
              <strong className="text-slate-900 font-bold">{routineData.classTeacher}</strong>
            </div>
          </div>
        </div>

        {/* Day Filter Pills */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-sm font-bold text-slate-500 mr-2 shrink-0">Filter Day:</span>
          {["All", ...WEEK_DAYS].map((day) => {
            const isActive = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {day === "All" ? "Full Week" : day}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Timetable Grid (Desktop View) */}
      <div className="hidden md:block bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-5 w-32 text-center border-r border-slate-200 text-sm font-extrabold text-slate-900">
                  Day
                </th>
                <th className="py-4 px-3 text-center">
                  <span className="block text-sm sm:text-base font-extrabold text-slate-900">Period 1</span>
                  <span className="text-xs text-slate-500 font-semibold mt-0.5 block">08:00 – 08:45</span>
                </th>
                <th className="py-4 px-3 text-center">
                  <span className="block text-sm sm:text-base font-extrabold text-slate-900">Period 2</span>
                  <span className="text-xs text-slate-500 font-semibold mt-0.5 block">08:45 – 09:30</span>
                </th>
                <th className="py-4 px-3 text-center">
                  <span className="block text-sm sm:text-base font-extrabold text-slate-900">Period 3</span>
                  <span className="text-xs text-slate-500 font-semibold mt-0.5 block">09:30 – 10:15</span>
                </th>
                <th className="py-4 px-3 text-center">
                  <span className="block text-sm sm:text-base font-extrabold text-slate-900">Period 4</span>
                  <span className="text-xs text-slate-500 font-semibold mt-0.5 block">10:15 – 11:00</span>
                </th>
                <th className="py-4 px-2 text-center bg-amber-50/70 border-x border-slate-200 w-28">
                  <span className="block text-amber-900 font-extrabold text-sm sm:text-base">Break</span>
                  <span className="text-xs text-amber-700 font-semibold mt-0.5 block">11:00 – 11:30</span>
                </th>
                <th className="py-4 px-3 text-center">
                  <span className="block text-sm sm:text-base font-extrabold text-slate-900">Period 5</span>
                  <span className="text-xs text-slate-500 font-semibold mt-0.5 block">11:30 – 12:15</span>
                </th>
                <th className="py-4 px-3 text-center">
                  <span className="block text-sm sm:text-base font-extrabold text-slate-900">Period 6</span>
                  <span className="text-xs text-slate-500 font-semibold mt-0.5 block">12:15 – 01:00</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displaySchedule.map((dayRoutine) => (
                <tr key={dayRoutine.day} className="hover:bg-slate-50/50 transition">
                  {/* Day Column */}
                  <td className="py-5 px-5 font-black text-slate-900 bg-slate-50/60 border-r border-slate-200 text-center text-sm sm:text-base">
                    {dayRoutine.day}
                  </td>

                  {/* Period Cells */}
                  {dayRoutine.periods.map((period, idx) => {
                    if (period.isBreak) {
                      return (
                        <td
                          key={idx}
                          className="py-4 px-2 bg-amber-50/40 border-x border-slate-200 text-center align-middle"
                        >
                          <div className="flex flex-col items-center justify-center text-amber-800 space-y-1">
                            <Coffee size={18} className="text-amber-600" />
                            <span className="text-xs sm:text-sm font-extrabold">Tiffin</span>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={idx} className="py-4 px-3 align-top">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-1.5 transition hover:shadow-2xs">
                          <div className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                            {period.subject}
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-600 truncate" title={period.teacher}>
                            {period.teacher}
                          </div>
                          <div className="text-xs font-semibold text-slate-400 font-mono pt-1">
                            {period.room}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Mobile Cards View (Hidden on Desktop) */}
      <div className="block md:hidden space-y-5">
        {displaySchedule.map((dayRoutine) => (
          <div
            key={dayRoutine.day}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
          >
            {/* Day Header */}
            <div className="bg-slate-900 px-5 py-3 text-white flex items-center justify-between text-sm sm:text-base">
              <span className="font-extrabold tracking-wide">{dayRoutine.day}</span>
              <span className="text-slate-300 text-xs font-mono font-bold">
                {dayRoutine.periods.filter((p) => !p.isBreak).length} Classes
              </span>
            </div>

            {/* Periods List */}
            <div className="p-4 space-y-3">
              {dayRoutine.periods.map((period, pIdx) => {
                if (period.isBreak) {
                  return (
                    <div
                      key={pIdx}
                      className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 flex items-center gap-3 text-amber-900"
                    >
                      <Coffee size={20} className="shrink-0 text-amber-600" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-extrabold text-sm">Tiffin & Refreshment Break</span>
                        <span className="text-xs sm:text-sm font-bold text-amber-700 font-mono">11:00 AM – 11:30 AM</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={pIdx}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="h-6 w-6 rounded-md bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs">
                          {period.periodNumber}
                        </span>
                        <span className="font-extrabold text-sm sm:text-base text-slate-900">{period.subject}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-600 font-mono bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                        {period.startTime} – {period.endTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-medium pt-1.5 border-t border-slate-200/60">
                      <span className="font-semibold">{period.teacher}</span>
                      <span className="font-mono text-slate-500">{period.room}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

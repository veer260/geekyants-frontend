
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

// Multiple static date ranges
const dateRanges = [
  {
    from: new Date(2025, 5, 12),
    to: new Date(2025, 5, 18),
    color: "rgba(59, 130, 246, 0.5)", // blue
  },
  {
    from: new Date(2025, 5, 15),
    to: new Date(2025, 5, 20),
    color: "rgba(16, 185, 129, 0.5)", // green
  },
  {
    from: new Date(2025, 6, 1),
    to: new Date(2025, 6, 10),
    color: "rgba(236, 72, 153, 0.5)", // pink
  },
]

export function Calendar05() {
  return (
    <Calendar
      mode="single"
      defaultMonth={dateRanges[0].from}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm [&_.rdp-day]:relative [&_.rdp-day]:overflow-visible"
      components={{
        DayContent: ({ date }) => {
          const activeRanges = dateRanges.filter(
            (r) => date >= r.from && date <= r.to
          )

          return (
            <div className="relative w-full h-full flex items-center justify-center">
              {activeRanges.map((range, index) => (
                <div
                  key={index}
                  className="absolute left-[2px] right-[2px] h-[4px] rounded-sm"
                  style={{
                    backgroundColor: range.color,
                    bottom: `${2 + index * 5}px`, // stack bars
                  }}
                />
              ))}
              <span className="relative z-10">{date.getDate()}</span>
            </div>
          )
        },
      }}
    />
  )
}

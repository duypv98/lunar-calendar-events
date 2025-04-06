import { SolarDate } from "@nghiavuive/lunar_date_vi";
import classNames from "classnames";
import moment from 'moment';
import "moment/locale/vi";
import { useState } from "react";
import { Calendar, CalendarProps, momentLocalizer } from "react-big-calendar";
const localizer = momentLocalizer(moment);

const MainCalendar = () => {
  const [view, setView] = useState<CalendarProps["view"]>("month");
  return <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-2 py-2 mx-auto md:h-screen lg:py-0">
      <Calendar
        className="bg-white"
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "67vh", width: "80vw" }}
        view={view}
        onView={setView}
        components={{
          dateCellWrapper(props) {
            const index = props.range.indexOf(props.value);
            const solarDate = new SolarDate(props.value);
            const lunarDate = solarDate.toLunarDate().get();
            let lunarDateStr = `${lunarDate.day}`;
            if (lunarDate.day === 1 || (view === "week" && index === 0)) {
              lunarDateStr = `${lunarDate.day}/${lunarDate.month}`;
              if (lunarDate.leap_month) lunarDateStr += " (nhuận)";
            }
            return <>
              {props.children}
              <span className={classNames("absolute h-full border-r-[1px] border-[#d9d9d9]",
                { hidden: view !== "month" }
              )} style={{
                left: `calc(100% / 7 * ${index})`,
                width: `calc(100% / ${view === "day" ? 1 : 7})`
              }} />
              <span
                className={classNames("absolute flex justify-center",
                  { ["bottom-1 pr-1"]: view === "month" },
                  { hidden: view === "day" },
                )}
                style={{
                  left: `calc(100% / 7 * ${index})`,
                  width: `calc(100% / ${view === "day" ? 1 : 7})`,
                }}
              >{lunarDateStr}</span>
            </>
          }
        }}
      />
    </div>
  </section>
}

export default MainCalendar;
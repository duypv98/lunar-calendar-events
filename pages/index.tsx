import classNames from "classnames";
import moment from 'moment';
import "moment/locale/vi";
import { useOptimistic, useState } from "react";
import { Calendar, CalendarProps, momentLocalizer } from 'react-big-calendar';
import { LunarDate, SolarDate } from "@nghiavuive/lunar_date_vi";

const localizer = momentLocalizer(moment);

export default function Page() {
  const [events, eventDispatch] = useOptimistic<Event[], {
    type: "get",
    payload: Event[]
  }>([], (state, action) => {
    switch (action.type) {
      case "get":
        return action.payload
      default:
        return state
    }
  });
  const [view, setView] = useState<CalendarProps["view"]>("month");

  return <>
    <Calendar
      localizer={localizer}
      events={[]}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
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
  </>
}
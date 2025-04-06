import { apiGetEvents } from "@/apis/event.api";
import Event, { EventRecurringType } from "@/models/Event";
import { LunarDate, SolarDate } from "@nghiavuive/lunar_date_vi";
import classNames from "classnames";
import _ from "lodash";
import moment from 'moment';
import "moment/locale/vi";
import { useSession } from "next-auth/react";
import { title } from "process";
import { startTransition, useEffect, useMemo, useOptimistic, useRef, useState } from "react";
import { Calendar, CalendarProps, momentLocalizer } from "react-big-calendar";
const localizer = momentLocalizer(moment);

const MainCalendar = () => {
  const { status, data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<CalendarProps["view"]>("month");
  const [range, setRange] = useState<Date[] | { start: Date; end: Date }>({
    start: moment().startOf("month").toDate(),
    end: moment().endOf("month").toDate()
  });
  const getEventController = useRef<AbortController | null>(null);
  const lunarYears = useMemo(() => {
    const startDate = Array.isArray(range) ? range[0] : range.start;
    const endDate = (Array.isArray(range) ? range[1] : range.end) || startDate;
    const days = moment(endDate).diff(moment(startDate), "days") + 1;
    const mRange = Array.from({ length: days }, (_, index) => {
      return moment(startDate).clone().add(index, "days").toDate();
    });
    return _.uniq(mRange.map((m) => {
      return new SolarDate(m).toLunarDate().get().year;
    }))
  }, [range]);

  const years = useMemo(() => {
    const startDate = Array.isArray(range) ? range[0] : range.start;
    const endDate = (Array.isArray(range) ? range[1] : range.end) || startDate;
    const days = moment(endDate).diff(moment(startDate), "days") + 1;
    const mRange = Array.from({ length: days }, (_, index) => {
      return moment(startDate).clone().add(index, "days");
    });
    return _.uniq(mRange.map((m) => {
      return m.year();
    }))
  }, [lunarYears]);

  // @ts-ignore
  const userId = +session?.user?.id;
  useEffect(() => {
    if (status !== "authenticated" || isNaN(userId) || !userId) return;
    const startDate = Array.isArray(range) ? range[0] : range.start;
    const endDate = (Array.isArray(range) ? range[1] : range.end) || startDate;
    const controller = new AbortController();
    getEventController.current = controller;
    apiGetEvents({
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      signal: controller.signal
    }).then((events) => {
      startTransition(() => {
        setEvents(events);
      })
    })
  }, [status, userId, range]);

  return <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-2 py-2 mx-auto md:h-screen lg:py-0">
      <Calendar
        className="bg-white"
        localizer={localizer}
        onRangeChange={(range) => {
          if (getEventController.current) {
            getEventController.current.abort();
          }
          setRange(range);
        }}
        events={events.flatMap((e) => {
          let startTime = e.start_time;
          let endTime = e.end_time;

          if (!startTime || !endTime) {
            // Check recurring
            if (e.recurring_type === EventRecurringType.Yearly) {
              // TODO: range of recurring
              if (e.is_lunar) {
                return lunarYears.map((ly) => {
                  const ld = new LunarDate({ year: ly, month: e.recurring_month, day: e.recurring_date, leap_month: e.leap_month });
                  ld.init();
                  const sl = ld.toSolarDate().get();
                  const start = moment(`${sl.year}-${sl.month}-${sl.day} ${e.start_time_str}`);
                  const end = moment(`${sl.year}-${sl.month}-${sl.day} ${e.end_time_str}`);
                  return {
                    title: e.title,
                    start: start.toDate(),
                    end: end.toDate()
                  }
                })
              } else {
                return years.map((y) => {
                  const start = moment(`${y}-${e.recurring_month}-${e.recurring_date} ${e.start_time_str}`);
                  const end = moment(`${y}-${e.recurring_month}-${e.recurring_date} ${e.end_time_str}`);
                  return {
                    title: e.title,
                    start: start.toDate(),
                    end: end.toDate()
                  }
                })
              }
            }
          }
          if (!startTime || !endTime) return null;

          return {
            title: e.title,

            start: new Date(startTime),
            end: new Date(endTime),
          }
        }).filter(Boolean)}
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
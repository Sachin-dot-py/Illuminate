from itertools import product
from statistics import median
from queue import PriorityQueue


class Schedule:
    def __init__(self, unavailabilities):
        self.schedule = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: []
        }
        self.unavailabilities = unavailabilities

    def get_median_start_time(self):
        start_times = []
        for day in self.schedule:
            if len(self.schedule[day]) == 0:
                continue
            start_times.append(min([int(part['start']) for part in self.schedule[day]]))
        start_times.sort()
        return median(start_times)

    def get_min_start_time(self):
        start_times = []
        for day in self.schedule:
            if len(self.schedule[day]) == 0:
                continue
            start_times.append(min([int(part['start']) for part in self.schedule[day]]))
        return min(start_times)

    def get_median_end_time(self):
        end_times = []
        for day in self.schedule:
            if len(self.schedule[day]) == 0:
                continue
            end_times.append(max([int(part['end']) for part in self.schedule[day]]))
        end_times.sort()
        return median(end_times)

    def get_max_end_time(self):
        end_times = []
        for day in self.schedule:
            if len(self.schedule[day]) == 0:
                continue
            end_times.append(max([int(part['end']) for part in self.schedule[day]]))
        return max(end_times)

    def check_conflict(self, class_parts):
        for part in class_parts:  # Lecture and Discussion(s)
            for day in part['day']:
                day = int(day)
                for existing_class in self.schedule[day]:
                    # Is overlapping
                    if (existing_class['start'] <= part['start'] <= existing_class['end']) or (
                           part['start'] <= existing_class['start'] <= part['end']):
                        return True
                for unavailability in self.unavailabilities[str(day)]:
                    # Is overlapping
                    if (unavailability[0] <= int(part['start']) <= unavailability[1]) or (
                            int(part['start']) <= unavailability[0] <= int(part['end'])):
                        return True
        return False

    def add_class(self, class_parts):
        if self.check_conflict(class_parts):
            return False
        for part in class_parts:  # Lecture and Discussion(s)
            for day in part['day']:
                day = int(day)
                self.schedule[day].append(part)
        return True


def generate_schedules(classes, sort_by, unavailabilities):
    schedules = PriorityQueue()

    combinations = product(*classes.values())
    for i, combination in enumerate(combinations):
        schedule = Schedule(unavailabilities)
        for class_parts in combination:
            if not schedule.add_class(class_parts):
                break
        else:
            if sort_by == 'EARLIEST':
                schedules.put((schedule.get_median_end_time(), schedule.get_max_end_time(), i, schedule))
            else:
                schedules.put((schedule.get_median_start_time() * -1, schedule.get_min_start_time() * -1, i, schedule))

    return schedules, schedules.qsize()

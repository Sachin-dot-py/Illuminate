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
            start_times.append(min([part['start'] for part in self.schedule[day]]))
        start_times.sort()
        return median(start_times)

    def get_median_end_time(self):
        end_times = []
        for day in self.schedule:
            end_times.append(max([part['end'] for part in self.schedule[day]]))
        end_times.sort()
        return median(end_times)
    
    # def __le__(self, other):
    #     if self.sort_by == "LATEST": # Starts latest
    #         return self.get_median_start_time() >= other.get_median_start_time()
    #     elif self.sort_by == "EARLIEST": # Ends earliest
    #         return self.get_median_start_time() <= other.get_median_start_time()

    def check_conflict(self, class_parts):
        for part in class_parts:  # Lecture and Discussion(s)
            for day in part['day'].split(""):
                day = int(day)
                for existing_class in self.schedule[day]:
                    # Is overlapping
                    if (part['start'] >= existing_class['start'] and part['start'] <= existing_class['end']) or (existing_class['start'] >= part['start'] and existing_class['start'] <= part['end']):
                        return True
                for unavailability in self.unavailabilities[day]:
                    # Is overlapping
                    if (part['start'] >= unavailability[0] and part['start'] <= unavailability[1]) or (unavailability[0] >= part['start'] and unavailability[0] <= part['end']):
                        return True
        return False
                
    
    def add_class(self, class_parts):
        if self.check_conflict(class_parts):
            return False
        for part in class_parts:  # Lecture and Discussion(s)
            for day in part['day'].split(""):
                day = int(day)
                self.schedule[day].append(part)
        return True
    

def generate_schedules(classes, sort_by, unavailabilities):

    schedules = PriorityQueue()

    combinations = product(*classes.values())
    for combination in combinations:
        schedule = Schedule(unavailabilities)
        for class_parts in combination:
            if not schedule.add_class(class_parts):
                break
        else:
            if sort_by == 'EARLIEST':
                schedules.put((schedule.get_median_end_time(), schedule))
            else:
                schedules.put((schedule.get_median_start_time()*-1, schedule))
    
    return schedules
    
    


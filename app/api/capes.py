import csv

def read_csv():
    with open('../resources/capes_data.csv', 'r') as file:
        csvreader = csv.reader(file)
        
        fields = next(csvreader)
        rows = []

        for row in csvreader:
            rows.append(row)
    return rows

def find_comb(prof, course, data):
    for row in data:
        if (''.join(prof.split(',')) == row[0]) and ((course.upper() + " ") in row[1]):
            return row
    return False

def get_capes_data(schedule):
    data = read_csv()
    for day in schedule.schedule.values():
        for unit in day:
            row = find_comb(unit['professor'], unit['code'], data)
            if row:
                unit['percentClass'] = row[5]
                unit['percentProf'] = row[6]
                unit['studyHours'] = row[7]
                unit['avgGrade'] = row[9]
    return schedule

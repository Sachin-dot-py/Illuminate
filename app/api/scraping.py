import requests
import re
from bs4 import BeautifulSoup


class Scraper:
    url = "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm"
    days_map = {
        "M": "1",
        "Tu": "2",
        "W": "3",
        "Th": "4",
        "F": "5",
        "Sa": "6",
        "Su": "7",
    }
    params = {
            "selectedTerm": "SP24",
            "xsoc_term": "",
            "loggedIn": "false",
            "tabNum": "tabs-crs",
            "_selectedSubjects": "1",
            "schedOption1": "true",
            "_schedOption1": "on",
            "_schedOption11": "on",
            "_schedOption12": "on",
            "schedOption2": "true",
            "_schedOption2": "on",
            "_schedOption4": "on",
            "_schedOption5": "on",
            "_schedOption3": "on",
            "_schedOption7": "on",
            "_schedOption8": "on",
            "_schedOption13": "on",
            "_schedOption10": "on",
            "_schedOption9": "on",
            "schDay": "S",
            "_schDay": "on",
            "schStartTime": "12:00",
            "schStartAmPm": "0",
            "schEndTime": "12:00",
            "schEndAmPm": "0",
            "_selectedDepartments": "1",
            "schedOption1Dept": "true",
            "_schedOption1Dept": "on",
            "_schedOption11Dept": "on",
            "_schedOption12Dept": "on",
            "schedOption2Dept": "true",
            "_schedOption2Dept": "on",
            "_schedOption4Dept": "on",
            "_schedOption5Dept": "on",
            "_schedOption3Dept": "on",
            "_schedOption7Dept": "on",
            "_schedOption8Dept": "on",
            "_schedOption13Dept": "on",
            "_schedOption10Dept": "on",
            "_schedOption9Dept": "on",
            "schDayDept": "S",
            "_schDayDept": "on",
            "schStartTimeDept": "12:00",
            "schStartAmPmDept": "0",
            "schEndTimeDept": "12:00",
            "schEndAmPmDept": "0",
            "sections": "",
            "instructorType": "begin",
            "instructor": "",
            "titleType": "contain",
            "title": "",
            "_hideFullSec": "on",
            "_showPopup": "on",
        }

    def __init__(self, classes):
        self.params['courses'] = "\r\n".join(classes)

    @staticmethod
    def parse_times(string):
        match = re.match(r'(\d+):(\d+)([ap])-(\d+):(\d+)([ap])', string)

        if match:
            hour1 = int(match.group(1))
            minute1 = int(match.group(2))
            period1 = match.group(3)
            hour2 = int(match.group(4))
            minute2 = int(match.group(5))
            period2 = match.group(6)

            # Convert to 24-hour format
            if period1 == 'p' and hour1 != 12:
                hour1 += 12
            if period2 == 'p' and hour2 != 12:
                hour2 += 12

            # Format the time strings with leading zeros
            time1_formatted = f"{hour1:02d}{minute1:02d}"
            time2_formatted = f"{hour2:02d}{minute2:02d}"

            return time1_formatted, time2_formatted

    def make_request(self, page=1):
        response = requests.get(self.url, params=dict(page=page, **self.params))
        if response.status_code != 200:
            raise Exception("Request failed")
        
        return response.text
    
    def get_classes(self, professor_prefs=None):
        responsetext = self.make_request(page=1)
        soup = BeautifulSoup(responsetext, 'html.parser')
        try:
            pagetext = soup.find_all("table")[2].find("td", {"align": "right"}).text.encode('ascii', 'ignore').decode('ascii').strip()
            numpages = int(re.search(r'1of(\d+)', pagetext).group(1))
        except:
            print("Error parsing number of pages")
            numpages = 1
        tables = [soup.find("table", {"class": "tbrdr"})]
        if numpages > 1:
            for i in range(2, numpages + 1):
                tables.append(BeautifulSoup(self.make_request(page=i), 'html.parser').find("table", {"class": "tbrdr"}))
        
        classes = {}
        cur_dept = ""
        cur_class = ""
        class_parts = []
        for table in tables:
            for row in table.find_all("tr"):
                if "Cancelled" in row.text:
                    continue
                h2 = row.find("h2")
                tds = row.find_all("td", {"class": "crsheader"})
                if h2:
                    match = re.search(r'\((.*?)\)', h2.getText())
                    if match and 5 >= len(match.group(1).strip()) >= 2:
                        cur_dept = match.group(1).strip()
                elif tds:
                    cur_class = tds[1].getText().strip()
                    class_parts = []
                else:
                    cols = row.find_all("td", {"class": "brdr"})
                    if cols:
                        is_enrollable = bool(cols[2].getText().strip()) # If there is an ID, it is enrollable.
                        meeting_type = cols[3].getText().strip()
                        if "/" in cols[3].getText().strip():
                            continue # This is a Final or a Midterm - skip this.
                        section = cols[4].getText().strip()
                        days = cols[5].getText().strip()
                        for key in self.days_map.keys(): # Convert to MTuW to 123
                            days = days.replace(key, self.days_map[key])
                        time1, time2 = self.parse_times(cols[6].text)
                        location = cols[7].getText().strip()
                        room = cols[8].getText().strip()
                        instructor = cols[9].getText().strip()

                        new_class = {
                                "code": cur_dept + " " + cur_class,
                                "type": meeting_type,
                                "section": section,
                                "day": days,
                                "start": time1,
                                "end": time2,
                                "location": location + " " + room,
                                "professor": instructor,
                        }
                        if not is_enrollable:
                            # Reset class parts and add this to class list
                            class_parts = [new_class]
                        else:
                            # Check if this professor is preferred by the user. If not, don't add this class.
                            if professor_prefs and new_class['professor'] not in professor_prefs.get(cur_dept + " " + cur_class, []):
                                continue
                            # Add to class list with whatever class is here
                            if cur_dept + " " + cur_class in classes:
                                classes[cur_dept + " " + cur_class].append(class_parts + [new_class])
                            else:   
                                classes[cur_dept + " " + cur_class] = [class_parts + [new_class]]
        return classes


if __name__ == "__main__":
    # Testing
    print(Scraper(["CSE 11", "CSE 12", "MCWP 40", "LIFR 1D"]).get_classes())
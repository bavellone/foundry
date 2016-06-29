
export const createTimeTree = `
WITH range(1980, 2020) AS years, range(1,12) as months
CREATE (root:TimeTreeRoot)
FOREACH(year IN years | 
	  MERGE (y:Year {year: year})<-[:CHILD]-(root)
	  FOREACH(month IN months | 
		    CREATE (m:Month {month: month})
		    MERGE (y)-[:HAS_MONTH]->(m)
		    FOREACH(day IN (CASE
						WHEN month IN [1,3,5,7,8,10,12] THEN range(1,31) 
						WHEN month = 2 THEN 
							CASE
								WHEN year % 4 <> 0 THEN range(1,28)
								WHEN year % 100 <> 0 THEN range(1,29)
								WHEN year % 400 <> 0 THEN range(1,29)
								ELSE range(1,28)
							END
						ELSE range(1,30)
						END) |      
				CREATE (d:Day {day: day})
				MERGE (m)-[:HAS_DAY]->(d)
				)
		)
)

WITH *

MATCH (year:Year)-[:HAS_MONTH]->(month)-[:HAS_DAY*0..1]->(day)
WITH year,month,day
ORDER BY year.year, month.month, day.day
WITH collect(DISTINCT year) as years, collect(DISTINCT month) as months, collect(day) as days

FOREACH(i in RANGE(0, size(years)-2) | 
		FOREACH(year1 in [years[i]] | 
        FOREACH(year2 in [years[i+1]] | 
            CREATE UNIQUE (year1)-[:NEXT]->(year2))))

FOREACH(i in RANGE(0, size(months)-2) | 
		FOREACH(month1 in [months[i]] | 
        FOREACH(month2 in [months[i+1]] | 
            CREATE UNIQUE (month1)-[:NEXT]->(month2))))

FOREACH(i in RANGE(0, size(days)-2) | 
		FOREACH(day1 in [days[i]] | 
        FOREACH(day2 in [days[i+1]] | 
            CREATE UNIQUE (day1)-[:NEXT]->(day2))))
`;

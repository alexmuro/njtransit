1 - Change route values in /otp/graph-builder.xml on lines 43,52,63
2 - Change routes in /otp/webapps/WEB-INF/classes/data-sources.xml on line 7
3 - Change routes in otp/webapps/opentripplanner-api-webapp/WEB-INF/classes/data-sources.xml
4 - in otp/webapps | zip -r opentripplanner-api-webapp.zip opentripplanner-api-webapp
5 - in otp/webapps | rm opentripplanner-api-webapp.war
6 - in otp/webapps | mv opentripplanner-api-webapp.zip opentripplanner-api-webapp.war
7 - edit opentripplanner.conf for route on line 20
8 - sudo cp ~/code/njtransit/config/opentripplanner.conf /etc/init/
9 - I have had instances where 

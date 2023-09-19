const userLogin = 'SELECT * FROM "User" WHERE "email" = $1 AND "password" = $2';        // User login
const userProfile = 'SELECT "name", "email", "role" FROM "User" WHERE "userid" = $1';   //  User profile
/*
const upcomingClass = 'SELECT "Timetable"."starttime", "Timetable"."endtime", "Course"."title",'
                      '"LectureRoom"."roomname" FROM "Timetable"'
                      'INNER JOIN "Course" ON "Timetable"."coursecode" = "Course"."coursecode"'
                      'INNER JOIN "LectureRoom" ON "Timetable"."roomname" = "LectureRoom"."roomname"'
                      'WHERE "Timetable"."UserID" = $1'
                      'AND "Timetable"."starttime" > CURRENT_TIMESTAMP'
                      'ORDER BY "Timetable"."starttime" ASC';
*/



module.exports = {
    userLogin,
    userProfile,
    // upcomingClass,
};
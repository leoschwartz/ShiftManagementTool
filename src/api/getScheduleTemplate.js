export const getScheduleTemplate = async (userToken, employeeId, date) => {
  // date parameter should be completely ignored
  // it's only a parameter so it can be called the same way as the non-template version
  // todo
  return {
        id:"0000-0000",
        archived: false,
        desc: "",
        employeeId: employeeId,
        startTime: new Date(1900, 1, 1),
        endTime: new Date(1900, 1, 7),
        shiftIdList: []
  };
};

export function useDateLibrary() {



const formatDate = (date) => {
    if (date == null) return
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('nl-NL', options);
  }

  const months = [
    { name: 'Januari', id: 1 },
    { name: 'Februari', id: 2 },
    { name: 'Maart', id: 3 },
    { name: 'April', id: 4 },
    { name: 'Mei', id: 5 },
    { name: 'Juni', id: 6 },
    { name: 'Juli', id: 7 },
    { name: 'Augustus', id: 8 },
    { name: 'September', id: 9 },
    { name: 'Oktober', id: 10 },
    { name: 'November', id: 11 },
    { name: 'December', id: 12 }
  
  ]


  const formatMonthYear = (monthYearString) => {
    if (!monthYearString) return ''
    const year = '20' + monthYearString.substring(0,2)
    const month = months[parseInt(monthYearString.substring(2)) - 1]
    return `${month.name} ${year}`
  }

  return { formatDate,months, formatMonthYear };
}

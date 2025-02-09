import moment from 'moment';

moment.updateLocale('ar', {
  months:
    'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split(
      '_',
    ),
  monthsShort:
    'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split(
      '_',
    ),
  monthsParseExact: true,
  weekdays: 'الأحد_الاثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
  weekdaysShort: 'الأحد_الاثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split(
    '_',
  ),
  weekdaysMin: 'أحد_اثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'D/M/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm',
  },
  calendar: {
    sameDay: '[اليوم عند] LT',
    nextDay: '[غدًا عند] LT',
    nextWeek: 'dddd [عند] LT',
    lastDay: '[أمس عند] LT',
    lastWeek: 'dddd [عند] LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: 'في %s',
    past: 'منذ %s',
    s: 'بضع ثوان',
    m: 'دقيقة واحدة',
    mm: '%d دقائق',
    h: 'ساعة واحدة',
    hh: '%d ساعات',
    d: 'يوم واحد',
    dd: '%d أيام',
    M: 'شهر واحد',
    MM: '%d أشهر',
    y: 'سنة واحدة',
    yy: '%d سنوات',
  },
  dayOfMonthOrdinalParse: /\d{1,2}$/,
  ordinal: function (number) {
    const unit = number % 10;
    const tens = number % 100;

    if (unit === 1 && tens !== 11) {
      return number + 'st';
    } else if (unit === 2 && tens !== 12) {
      return number + 'nd';
    } else if (unit === 3 && tens !== 13) {
      return number + 'rd';
    } else {
      return number + 'th';
    }
  },
  meridiemParse: /ص|م/,
  isPM: function (input) {
    return input === 'م';
  },
  meridiem: function (hours, minutes, isLower) {
    if (hours < 12) {
      return 'ص';
    } else {
      return 'م';
    }
  },
  week: {
    dow: 6, // Saturday is the first day of the week.
    doy: 12, // The week that contains January 1st is the first week of the year.
  },
});

export default moment;

export interface Period {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
  isBreak?: boolean;
}

export interface DayRoutine {
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  periods: Period[];
}

export interface ClassRoutineInfo {
  classId: string;
  className: string;
  group?: 'Science' | 'Commerce' | 'Arts' | 'General';
  section: 'A' | 'B' | 'C';
  roomNumber: string;
  classTeacher: string;
  schedule: DayRoutine[];
}

export const CLASS_OPTIONS = [
  { id: '1', label: 'Class 1', hasGroup: false },
  { id: '2', label: 'Class 2', hasGroup: false },
  { id: '3', label: 'Class 3', hasGroup: false },
  { id: '4', label: 'Class 4', hasGroup: false },
  { id: '5', label: 'Class 5', hasGroup: false },
  { id: '6', label: 'Class 6', hasGroup: false },
  { id: '7', label: 'Class 7', hasGroup: false },
  { id: '8', label: 'Class 8', hasGroup: false },
  { id: '9', label: 'Class 9', hasGroup: true },
  { id: '10', label: 'Class 10', hasGroup: true },
];

export const GROUP_OPTIONS = [
  { id: 'Science', label: 'Science' },
  { id: 'Commerce', label: 'Commerce (Business Studies)' },
  { id: 'Arts', label: 'Arts (Humanities)' },
];

export const SECTION_OPTIONS = [
  { id: 'A', label: 'Section A' },
  { id: 'B', label: 'Section B' },
  { id: 'C', label: 'Section C' },
];

export const WEEK_DAYS: Array<'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday'> = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
];

// Helper to build standard periods
const createDaySchedule = (
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday',
  subjects: Array<{ subject: string; teacher: string; room?: string }>,
  defaultRoom: string
): DayRoutine => {
  const timeSlots = [
    { start: '08:00 AM', end: '08:45 AM' },
    { start: '08:45 AM', end: '09:30 AM' },
    { start: '09:30 AM', end: '10:15 AM' },
    { start: '10:15 AM', end: '11:00 AM' },
    { start: '11:00 AM', end: '11:30 AM', isBreak: true },
    { start: '11:30 AM', end: '12:15 PM' },
    { start: '12:15 PM', end: '01:00 PM' },
  ];

  const periods: Period[] = [];
  let subjectIdx = 0;

  timeSlots.forEach((slot) => {
    if (slot.isBreak) {
      periods.push({
        periodNumber: 0,
        startTime: slot.start,
        endTime: slot.end,
        subject: 'Tiffin & Refreshment Break',
        teacher: 'Supervised',
        room: 'School Cafeteria / Yard',
        isBreak: true,
      });
    } else {
      const sub = subjects[subjectIdx] || { subject: 'Self Study / Library', teacher: 'Librarian' };
      periods.push({
        periodNumber: periods.filter((p) => !p.isBreak).length + 1,
        startTime: slot.start,
        endTime: slot.end,
        subject: sub.subject,
        teacher: sub.teacher,
        room: sub.room || defaultRoom,
        isBreak: false,
      });
      subjectIdx++;
    }
  });

  return { day, periods };
};

// ==========================================
// 1. PRIMARY ROUTINE GENERATOR (Class 1 to 5)
// ==========================================
const generatePrimaryRoutine = (classNum: string, section: 'A' | 'B' | 'C'): DayRoutine[] => {
  const room = `Room 10${classNum}-${section}`;

  if (section === 'B') {
    const teachers = {
      bangla: 'Mr. Rafiqul Islam',
      english: 'Ms. Fahmida Yasmin',
      math: 'Ms. Salma Khatun',
      science: 'Mr. Hasan Mahmud',
      bgs: 'Mr. Anwar Hossain',
      religion: 'Moulana Habibur Rahman',
      art: 'Ms. Nusrat Jahan',
      pe: 'Coach Farhan Ahmed',
    };

    return [
      createDaySchedule('Sunday', [
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Bangla', teacher: teachers.bangla },
        { subject: 'English', teacher: teachers.english },
        { subject: 'Religious & Moral Studies', teacher: teachers.religion },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      ], room),
      createDaySchedule('Monday', [
        { subject: 'English', teacher: teachers.english },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Bangla', teacher: teachers.bangla },
        { subject: 'Physical Education', teacher: teachers.pe },
        { subject: 'Arts & Crafts', teacher: teachers.art },
      ], room),
      createDaySchedule('Tuesday', [
        { subject: 'Bangla', teacher: teachers.bangla },
        { subject: 'English', teacher: teachers.english },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
        { subject: 'Religious & Moral Studies', teacher: teachers.religion },
        { subject: 'General Science', teacher: teachers.science },
      ], room),
      createDaySchedule('Wednesday', [
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'English', teacher: teachers.english },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'Bangla', teacher: teachers.bangla },
        { subject: 'Arts & Music', teacher: teachers.art },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      ], room),
      createDaySchedule('Thursday', [
        { subject: 'English', teacher: teachers.english },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Bangla', teacher: teachers.bangla },
        { subject: 'Weekly Assessment', teacher: teachers.math },
        { subject: 'General Knowledge & Quiz', teacher: teachers.bgs },
      ], room),
    ];
  }

  if (section === 'C') {
    const teachers = {
      bangla: 'Ms. Fahmida Yasmin',
      english: 'Ms. Salma Khatun',
      math: 'Mr. Anwar Hossain',
      science: 'Mr. Rafiqul Islam',
      bgs: 'Mr. Hasan Mahmud',
      religion: 'Moulana Habibur Rahman',
      art: 'Ms. Nusrat Jahan',
      pe: 'Coach Farhan Ahmed',
    };

    return [
      createDaySchedule('Sunday', [
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'English', teacher: teachers.english },
        { subject: 'Bangla', teacher: teachers.bangla },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
        { subject: 'Religious & Moral Studies', teacher: teachers.religion },
      ], room),
      createDaySchedule('Monday', [
        { subject: 'Bangla', teacher: teachers.bangla },
        { subject: 'English', teacher: teachers.english },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'Arts & Crafts', teacher: teachers.art },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Physical Education', teacher: teachers.pe },
      ], room),
      createDaySchedule('Tuesday', [
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'English', teacher: teachers.english },
        { subject: 'Religious & Moral Studies', teacher: teachers.religion },
        { subject: 'Bangla', teacher: teachers.bangla },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      ], room),
      createDaySchedule('Wednesday', [
        { subject: 'English', teacher: teachers.english },
        { subject: 'Bangla', teacher: teachers.bangla },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Arts & Music', teacher: teachers.art },
      ], room),
      createDaySchedule('Thursday', [
        { subject: 'Bangla', teacher: teachers.bangla },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'English', teacher: teachers.english },
        { subject: 'General Knowledge & Quiz', teacher: teachers.bgs },
        { subject: 'Weekly Assessment', teacher: teachers.math },
      ], room),
    ];
  }

  // Section A (Default)
  const teachers = {
    bangla: 'Ms. Salma Khatun',
    english: 'Mr. Rafiqul Islam',
    math: 'Mr. Hasan Mahmud',
    science: 'Ms. Fahmida Yasmin',
    bgs: 'Mr. Anwar Hossain',
    religion: 'Moulana Habibur Rahman',
    art: 'Ms. Nusrat Jahan',
    pe: 'Coach Farhan Ahmed',
  };

  return [
    createDaySchedule('Sunday', [
      { subject: 'Bangla', teacher: teachers.bangla },
      { subject: 'English', teacher: teachers.english },
      { subject: 'Mathematics', teacher: teachers.math },
      { subject: 'General Science', teacher: teachers.science },
      { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      { subject: 'Religious & Moral Studies', teacher: teachers.religion },
    ], room),
    createDaySchedule('Monday', [
      { subject: 'Mathematics', teacher: teachers.math },
      { subject: 'Bangla', teacher: teachers.bangla },
      { subject: 'English', teacher: teachers.english },
      { subject: 'General Science', teacher: teachers.science },
      { subject: 'Arts & Crafts', teacher: teachers.art },
      { subject: 'Physical Education', teacher: teachers.pe },
    ], room),
    createDaySchedule('Tuesday', [
      { subject: 'English', teacher: teachers.english },
      { subject: 'Mathematics', teacher: teachers.math },
      { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      { subject: 'Bangla', teacher: teachers.bangla },
      { subject: 'General Science', teacher: teachers.science },
      { subject: 'Religious & Moral Studies', teacher: teachers.religion },
    ], room),
    createDaySchedule('Wednesday', [
      { subject: 'Bangla', teacher: teachers.bangla },
      { subject: 'Mathematics', teacher: teachers.math },
      { subject: 'General Science', teacher: teachers.science },
      { subject: 'English', teacher: teachers.english },
      { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      { subject: 'Arts & Music', teacher: teachers.art },
    ], room),
    createDaySchedule('Thursday', [
      { subject: 'Mathematics', teacher: teachers.math },
      { subject: 'English', teacher: teachers.english },
      { subject: 'Bangla', teacher: teachers.bangla },
      { subject: 'General Science', teacher: teachers.science },
      { subject: 'General Knowledge & Quiz', teacher: teachers.bgs },
      { subject: 'Weekly Assessment', teacher: teachers.math },
    ], room),
  ];
};

// ==========================================
// 2. JUNIOR SECONDARY ROUTINE (Class 6 to 8)
// ==========================================
const generateJuniorRoutine = (classNum: string, section: 'A' | 'B' | 'C'): DayRoutine[] => {
  const room = `Room 20${classNum}-${section}`;

  if (section === 'B') {
    const teachers = {
      bangla: 'Ms. Rebecca Sultana',
      english: 'Dr. Shah Alam',
      math: 'Dr. Tanvir Ahmed',
      science: 'Mr. Jahangir Kabir',
      bgs: 'Engr. Mahfuzur Rahman',
      ict: 'Mr. Moniruzzaman',
      religion: 'Ustadh Kamal Uddin',
      agri: 'Ms. Parveen Begum',
    };

    return [
      createDaySchedule('Sunday', [
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Religious Studies', teacher: teachers.religion },
        { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 2' },
      ], room),
      createDaySchedule('Monday', [
        { subject: 'English 2nd Paper', teacher: teachers.english },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Agriculture Studies', teacher: teachers.agri },
      ], room),
      createDaySchedule('Tuesday', [
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 2' },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      ], room),
      createDaySchedule('Wednesday', [
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'English 2nd Paper', teacher: teachers.english },
        { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
        { subject: 'Religious Studies', teacher: teachers.religion },
        { subject: 'General Science (Practical)', teacher: teachers.science, room: 'Science Lab B' },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      ], room),
      createDaySchedule('Thursday', [
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'Weekly Tutorial & Problem Solving', teacher: teachers.math },
        { subject: 'Agriculture Studies', teacher: teachers.agri },
      ], room),
    ];
  }

  if (section === 'C') {
    const teachers = {
      bangla: 'Mr. Moniruzzaman',
      english: 'Ms. Rebecca Sultana',
      math: 'Mr. Jahangir Kabir',
      science: 'Dr. Shah Alam',
      bgs: 'Dr. Tanvir Ahmed',
      ict: 'Engr. Mahfuzur Rahman',
      religion: 'Ustadh Kamal Uddin',
      agri: 'Ms. Parveen Begum',
    };

    return [
      createDaySchedule('Sunday', [
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
        { subject: 'Religious Studies', teacher: teachers.religion },
      ], room),
      createDaySchedule('Monday', [
        { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'English 2nd Paper', teacher: teachers.english },
        { subject: 'Agriculture Studies', teacher: teachers.agri },
        { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 1' },
      ], room),
      createDaySchedule('Tuesday', [
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
        { subject: 'Religious Studies', teacher: teachers.religion },
      ], room),
      createDaySchedule('Wednesday', [
        { subject: 'English 2nd Paper', teacher: teachers.english },
        { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
        { subject: 'General Science (Practical)', teacher: teachers.science, room: 'Science Lab A' },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 1' },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      ], room),
      createDaySchedule('Thursday', [
        { subject: 'General Science', teacher: teachers.science },
        { subject: 'Mathematics', teacher: teachers.math },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'Weekly Tutorial & Problem Solving', teacher: teachers.math },
        { subject: 'Agriculture Studies', teacher: teachers.agri },
      ], room),
    ];
  }

  // Section A (Default)
  const teachers = {
    bangla: 'Dr. Shah Alam',
    english: 'Ms. Rebecca Sultana',
    math: 'Mr. Jahangir Kabir',
    science: 'Dr. Tanvir Ahmed',
    bgs: 'Mr. Moniruzzaman',
    ict: 'Engr. Mahfuzur Rahman',
    religion: 'Ustadh Kamal Uddin',
    agri: 'Ms. Parveen Begum',
  };

  return [
    createDaySchedule('Sunday', [
      { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      { subject: 'English 1st Paper', teacher: teachers.english },
      { subject: 'Mathematics', teacher: teachers.math },
      { subject: 'General Science', teacher: teachers.science },
      { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 1' },
      { subject: 'Religious Studies', teacher: teachers.religion },
    ], room),
    createDaySchedule('Monday', [
      { subject: 'Mathematics', teacher: teachers.math },
      { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
      { subject: 'English 2nd Paper', teacher: teachers.english },
      { subject: 'General Science', teacher: teachers.science },
      { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      { subject: 'Agriculture Studies', teacher: teachers.agri },
    ], room),
    createDaySchedule('Tuesday', [
      { subject: 'English 1st Paper', teacher: teachers.english },
      { subject: 'Mathematics', teacher: teachers.math },
      { subject: 'General Science', teacher: teachers.science },
      { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 1' },
    ], room),
    createDaySchedule('Wednesday', [
      { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
      { subject: 'Mathematics', teacher: teachers.math },
      { subject: 'English 2nd Paper', teacher: teachers.english },
      { subject: 'General Science (Practical)', teacher: teachers.science, room: 'Science Lab A' },
      { subject: 'Bangladesh & Global Studies', teacher: teachers.bgs },
      { subject: 'Religious Studies', teacher: teachers.religion },
    ], room),
    createDaySchedule('Thursday', [
      { subject: 'Mathematics', teacher: teachers.math },
      { subject: 'English 1st Paper', teacher: teachers.english },
      { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      { subject: 'General Science', teacher: teachers.science },
      { subject: 'Agriculture Studies', teacher: teachers.agri },
      { subject: 'Weekly Tutorial & Problem Solving', teacher: teachers.math },
    ], room),
  ];
};

// ==========================================
// 3. SCIENCE GROUP ROUTINE (Class 9 & 10)
// ==========================================
const generateScienceRoutine = (classNum: string, section: 'A' | 'B' | 'C'): DayRoutine[] => {
  const room = `Room 30${classNum}-${section} (Science Wing)`;

  if (section === 'B') {
    const teachers = {
      physics: 'Dr. Nasiruddin Ahmed',
      chemistry: 'Prof. Abdul Hannan',
      biology: 'Mr. Tariqul Islam',
      higherMath: 'Ms. Rashida Khanam',
      generalMath: 'Mr. Jahangir Kabir',
      bangla: 'Dr. Shah Alam',
      english: 'Ms. Rebecca Sultana',
      ict: 'Engr. Mahfuzur Rahman',
      religion: 'Ustadh Kamal Uddin',
    };

    return [
      createDaySchedule('Sunday', [
        { subject: 'Chemistry', teacher: teachers.chemistry, room: 'Chemistry Lab B' },
        { subject: 'Physics', teacher: teachers.physics, room: 'Physics Lab B' },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Higher Mathematics', teacher: teachers.higherMath },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'English 1st Paper', teacher: teachers.english },
      ], room),
      createDaySchedule('Monday', [
        { subject: 'Higher Mathematics', teacher: teachers.higherMath },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Chemistry', teacher: teachers.chemistry },
        { subject: 'Biology', teacher: teachers.biology, room: 'Biology Lab B' },
        { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 2' },
        { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
      ], room),
      createDaySchedule('Tuesday', [
        { subject: 'Physics (Theory)', teacher: teachers.physics },
        { subject: 'Biology (Practical)', teacher: teachers.biology, room: 'Biology Lab B' },
        { subject: 'English 2nd Paper', teacher: teachers.english },
        { subject: 'Chemistry', teacher: teachers.chemistry },
        { subject: 'Religious & Moral Studies', teacher: teachers.religion },
        { subject: 'Higher Mathematics', teacher: teachers.higherMath },
      ], room),
      createDaySchedule('Wednesday', [
        { subject: 'Chemistry (Practical Lab)', teacher: teachers.chemistry, room: 'Chemistry Lab B' },
        { subject: 'Physics (Practical Lab)', teacher: teachers.physics, room: 'Physics Lab B' },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bangla },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      ], room),
      createDaySchedule('Thursday', [
        { subject: 'Physics', teacher: teachers.physics },
        { subject: 'Higher Mathematics', teacher: teachers.higherMath },
        { subject: 'Chemistry', teacher: teachers.chemistry },
        { subject: 'Biology', teacher: teachers.biology },
        { subject: 'Creative Question Prep (CQ)', teacher: teachers.physics },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
      ], room),
    ];
  }

  if (section === 'C') {
    const teachers = {
      physics: 'Mr. Tariqul Islam',
      chemistry: 'Ms. Rashida Khanam',
      biology: 'Dr. Nasiruddin Ahmed',
      higherMath: 'Prof. Abdul Hannan',
      generalMath: 'Mr. Jahangir Kabir',
      bangla: 'Dr. Shah Alam',
      english: 'Ms. Rebecca Sultana',
      ict: 'Engr. Mahfuzur Rahman',
      religion: 'Ustadh Kamal Uddin',
    };

    return [
      createDaySchedule('Sunday', [
        { subject: 'Biology', teacher: teachers.biology, room: 'Biology Lab A' },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Physics', teacher: teachers.physics, room: 'Physics Lab A' },
        { subject: 'Chemistry', teacher: teachers.chemistry, room: 'Chemistry Lab A' },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      ], room),
      createDaySchedule('Monday', [
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Higher Mathematics', teacher: teachers.higherMath },
        { subject: 'Biology', teacher: teachers.biology },
        { subject: 'Chemistry', teacher: teachers.chemistry },
        { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
        { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 1' },
      ], room),
      createDaySchedule('Tuesday', [
        { subject: 'Higher Mathematics', teacher: teachers.higherMath },
        { subject: 'Chemistry', teacher: teachers.chemistry },
        { subject: 'Physics (Theory)', teacher: teachers.physics },
        { subject: 'Biology (Practical)', teacher: teachers.biology, room: 'Biology Lab A' },
        { subject: 'English 2nd Paper', teacher: teachers.english },
        { subject: 'Religious & Moral Studies', teacher: teachers.religion },
      ], room),
      createDaySchedule('Wednesday', [
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Physics (Practical Lab)', teacher: teachers.physics, room: 'Physics Lab A' },
        { subject: 'Chemistry (Practical Lab)', teacher: teachers.chemistry, room: 'Chemistry Lab A' },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Bangladesh & Global Studies', teacher: teachers.bangla },
      ], room),
      createDaySchedule('Thursday', [
        { subject: 'Biology', teacher: teachers.biology },
        { subject: 'Chemistry', teacher: teachers.chemistry },
        { subject: 'Higher Mathematics', teacher: teachers.higherMath },
        { subject: 'Physics', teacher: teachers.physics },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Creative Question Prep (CQ)', teacher: teachers.chemistry },
      ], room),
    ];
  }

  // Section A (Default)
  const teachers = {
    physics: 'Prof. Abdul Hannan',
    chemistry: 'Dr. Nasiruddin Ahmed',
    biology: 'Ms. Rashida Khanam',
    higherMath: 'Mr. Tariqul Islam',
    generalMath: 'Mr. Jahangir Kabir',
    bangla: 'Dr. Shah Alam',
    english: 'Ms. Rebecca Sultana',
    ict: 'Engr. Mahfuzur Rahman',
    religion: 'Ustadh Kamal Uddin',
  };

  return [
    createDaySchedule('Sunday', [
      { subject: 'Physics', teacher: teachers.physics, room: 'Physics Lab A' },
      { subject: 'Higher Mathematics', teacher: teachers.higherMath },
      { subject: 'Chemistry', teacher: teachers.chemistry, room: 'Chemistry Lab A' },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'English 1st Paper', teacher: teachers.english },
      { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
    ], room),
    createDaySchedule('Monday', [
      { subject: 'Chemistry', teacher: teachers.chemistry, room: 'Chemistry Lab A' },
      { subject: 'Biology', teacher: teachers.biology, room: 'Biology Lab A' },
      { subject: 'Higher Mathematics', teacher: teachers.higherMath },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
      { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 1' },
    ], room),
    createDaySchedule('Tuesday', [
      { subject: 'Biology (Practical)', teacher: teachers.biology, room: 'Biology Lab A' },
      { subject: 'Physics (Theory)', teacher: teachers.physics },
      { subject: 'Chemistry', teacher: teachers.chemistry },
      { subject: 'English 2nd Paper', teacher: teachers.english },
      { subject: 'Higher Mathematics', teacher: teachers.higherMath },
      { subject: 'Religious & Moral Studies', teacher: teachers.religion },
    ], room),
    createDaySchedule('Wednesday', [
      { subject: 'Physics (Practical Lab)', teacher: teachers.physics, room: 'Physics Lab A' },
      { subject: 'Chemistry (Practical Lab)', teacher: teachers.chemistry, room: 'Chemistry Lab A' },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'English 1st Paper', teacher: teachers.english },
      { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      { subject: 'Bangladesh & Global Studies', teacher: teachers.bangla },
    ], room),
    createDaySchedule('Thursday', [
      { subject: 'Higher Mathematics', teacher: teachers.higherMath },
      { subject: 'Physics', teacher: teachers.physics },
      { subject: 'Biology', teacher: teachers.biology },
      { subject: 'Chemistry', teacher: teachers.chemistry },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'Creative Question Prep (CQ)', teacher: teachers.higherMath },
    ], room),
  ];
};

// ==========================================
// 4. COMMERCE GROUP ROUTINE (Class 9 & 10)
// ==========================================
const generateCommerceRoutine = (classNum: string, section: 'A' | 'B' | 'C'): DayRoutine[] => {
  const room = `Room 31${classNum}-${section} (Commerce Wing)`;

  if (section === 'B') {
    const teachers = {
      accounting: 'Ms. Shamima Akter',
      finance: 'Mr. Saiful Islam, FCMA',
      businessEnt: 'Mr. Mustafizur Rahman',
      generalScience: 'Dr. Tanvir Ahmed',
      generalMath: 'Mr. Jahangir Kabir',
      bangla: 'Dr. Shah Alam',
      english: 'Ms. Rebecca Sultana',
      ict: 'Engr. Mahfuzur Rahman',
      religion: 'Ustadh Kamal Uddin',
    };

    return [
      createDaySchedule('Sunday', [
        { subject: 'Finance & Banking', teacher: teachers.finance },
        { subject: 'Accounting', teacher: teachers.accounting },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Business Entrepreneurship', teacher: teachers.businessEnt },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'English 1st Paper', teacher: teachers.english },
      ], room),
      createDaySchedule('Monday', [
        { subject: 'Accounting', teacher: teachers.accounting },
        { subject: 'Finance & Banking', teacher: teachers.finance },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 2' },
        { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
      ], room),
      createDaySchedule('Tuesday', [
        { subject: 'Accounting (Practice)', teacher: teachers.accounting },
        { subject: 'Business Entrepreneurship', teacher: teachers.businessEnt },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Finance & Banking', teacher: teachers.finance },
        { subject: 'Religious Studies', teacher: teachers.religion },
        { subject: 'English 2nd Paper', teacher: teachers.english },
      ], room),
      createDaySchedule('Wednesday', [
        { subject: 'Finance & Banking', teacher: teachers.finance },
        { subject: 'Accounting', teacher: teachers.accounting },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Business Case Studies', teacher: teachers.businessEnt },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      ], room),
      createDaySchedule('Thursday', [
        { subject: 'Business Entrepreneurship', teacher: teachers.businessEnt },
        { subject: 'Accounting (Financial Statements)', teacher: teachers.accounting },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Finance & Banking', teacher: teachers.finance },
        { subject: 'Weekly Model Assessment', teacher: teachers.finance },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
      ], room),
    ];
  }

  if (section === 'C') {
    const teachers = {
      accounting: 'Mr. Mustafizur Rahman',
      finance: 'Ms. Shamima Akter',
      businessEnt: 'Mr. Saiful Islam, FCMA',
      generalScience: 'Dr. Tanvir Ahmed',
      generalMath: 'Mr. Jahangir Kabir',
      bangla: 'Dr. Shah Alam',
      english: 'Ms. Rebecca Sultana',
      ict: 'Engr. Mahfuzur Rahman',
      religion: 'Ustadh Kamal Uddin',
    };

    return [
      createDaySchedule('Sunday', [
        { subject: 'Business Entrepreneurship', teacher: teachers.businessEnt },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Accounting', teacher: teachers.accounting },
        { subject: 'Finance & Banking', teacher: teachers.finance },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      ], room),
      createDaySchedule('Monday', [
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Accounting', teacher: teachers.accounting },
        { subject: 'Finance & Banking', teacher: teachers.finance },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
        { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 1' },
      ], room),
      createDaySchedule('Tuesday', [
        { subject: 'Finance & Banking', teacher: teachers.finance },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Accounting (Practice)', teacher: teachers.accounting },
        { subject: 'Business Entrepreneurship', teacher: teachers.businessEnt },
        { subject: 'English 2nd Paper', teacher: teachers.english },
        { subject: 'Religious Studies', teacher: teachers.religion },
      ], room),
      createDaySchedule('Wednesday', [
        { subject: 'Accounting', teacher: teachers.accounting },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Finance & Banking', teacher: teachers.finance },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Business Case Studies', teacher: teachers.businessEnt },
      ], room),
      createDaySchedule('Thursday', [
        { subject: 'Finance & Banking', teacher: teachers.finance },
        { subject: 'Business Entrepreneurship', teacher: teachers.businessEnt },
        { subject: 'Accounting (Financial Statements)', teacher: teachers.accounting },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Weekly Model Assessment', teacher: teachers.businessEnt },
      ], room),
    ];
  }

  // Section A (Default)
  const teachers = {
    accounting: 'Mr. Saiful Islam, FCMA',
    finance: 'Ms. Shamima Akter',
    businessEnt: 'Mr. Mustafizur Rahman',
    generalScience: 'Dr. Tanvir Ahmed',
    generalMath: 'Mr. Jahangir Kabir',
    bangla: 'Dr. Shah Alam',
    english: 'Ms. Rebecca Sultana',
    ict: 'Engr. Mahfuzur Rahman',
    religion: 'Ustadh Kamal Uddin',
  };

  return [
    createDaySchedule('Sunday', [
      { subject: 'Accounting', teacher: teachers.accounting },
      { subject: 'Finance & Banking', teacher: teachers.finance },
      { subject: 'Business Entrepreneurship', teacher: teachers.businessEnt },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'English 1st Paper', teacher: teachers.english },
      { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
    ], room),
    createDaySchedule('Monday', [
      { subject: 'Finance & Banking', teacher: teachers.finance },
      { subject: 'Accounting', teacher: teachers.accounting },
      { subject: 'General Science', teacher: teachers.generalScience },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
      { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 1' },
    ], room),
    createDaySchedule('Tuesday', [
      { subject: 'Business Entrepreneurship', teacher: teachers.businessEnt },
      { subject: 'Accounting (Practice)', teacher: teachers.accounting },
      { subject: 'Finance & Banking', teacher: teachers.finance },
      { subject: 'English 2nd Paper', teacher: teachers.english },
      { subject: 'General Science', teacher: teachers.generalScience },
      { subject: 'Religious Studies', teacher: teachers.religion },
    ], room),
    createDaySchedule('Wednesday', [
      { subject: 'Accounting', teacher: teachers.accounting },
      { subject: 'Finance & Banking', teacher: teachers.finance },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'English 1st Paper', teacher: teachers.english },
      { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      { subject: 'Business Case Studies', teacher: teachers.businessEnt },
    ], room),
    createDaySchedule('Thursday', [
      { subject: 'Accounting (Financial Statements)', teacher: teachers.accounting },
      { subject: 'Business Entrepreneurship', teacher: teachers.businessEnt },
      { subject: 'Finance & Banking', teacher: teachers.finance },
      { subject: 'General Science', teacher: teachers.generalScience },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'Weekly Model Assessment', teacher: teachers.accounting },
    ], room),
  ];
};

// ==========================================
// 5. ARTS / HUMANITIES ROUTINE (Class 9 & 10)
// ==========================================
const generateArtsRoutine = (classNum: string, section: 'A' | 'B' | 'C'): DayRoutine[] => {
  const room = `Room 32${classNum}-${section} (Humanities Wing)`;

  if (section === 'B') {
    const teachers = {
      history: 'Ms. Laila Arjumand',
      geography: 'Dr. Afzal Hossain',
      civics: 'Mr. Zahirul Haque',
      economics: 'Mr. Badrul Alam',
      generalScience: 'Dr. Tanvir Ahmed',
      generalMath: 'Mr. Jahangir Kabir',
      bangla: 'Dr. Shah Alam',
      english: 'Ms. Rebecca Sultana',
      ict: 'Engr. Mahfuzur Rahman',
      religion: 'Ustadh Kamal Uddin',
    };

    return [
      createDaySchedule('Sunday', [
        { subject: 'Geography & Environment', teacher: teachers.geography },
        { subject: 'History of Bangladesh & World Civ', teacher: teachers.history },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Civics & Citizenship', teacher: teachers.civics },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'English 1st Paper', teacher: teachers.english },
      ], room),
      createDaySchedule('Monday', [
        { subject: 'Economics', teacher: teachers.economics },
        { subject: 'Geography & Environment', teacher: teachers.geography },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 2' },
        { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
      ], room),
      createDaySchedule('Tuesday', [
        { subject: 'History of Bangladesh', teacher: teachers.history },
        { subject: 'Civics & Citizenship', teacher: teachers.civics },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Economics', teacher: teachers.economics },
        { subject: 'Religious Studies', teacher: teachers.religion },
        { subject: 'English 2nd Paper', teacher: teachers.english },
      ], room),
      createDaySchedule('Wednesday', [
        { subject: 'Geography (Map Work & Lab)', teacher: teachers.geography, room: 'Geography Lab' },
        { subject: 'History of Bangladesh', teacher: teachers.history },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Civics & Constitutional Law', teacher: teachers.civics },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      ], room),
      createDaySchedule('Thursday', [
        { subject: 'History of World Civilization', teacher: teachers.history },
        { subject: 'Economics (Macro & Micro)', teacher: teachers.economics },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Geography & Environment', teacher: teachers.geography },
        { subject: 'Weekly Creative Writing Assessment', teacher: teachers.history },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
      ], room),
    ];
  }

  if (section === 'C') {
    const teachers = {
      history: 'Mr. Badrul Alam',
      geography: 'Mr. Zahirul Haque',
      civics: 'Dr. Afzal Hossain',
      economics: 'Ms. Laila Arjumand',
      generalScience: 'Dr. Tanvir Ahmed',
      generalMath: 'Mr. Jahangir Kabir',
      bangla: 'Dr. Shah Alam',
      english: 'Ms. Rebecca Sultana',
      ict: 'Engr. Mahfuzur Rahman',
      religion: 'Ustadh Kamal Uddin',
    };

    return [
      createDaySchedule('Sunday', [
        { subject: 'Civics & Citizenship', teacher: teachers.civics },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'History of Bangladesh & World Civ', teacher: teachers.history },
        { subject: 'Geography & Environment', teacher: teachers.geography },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      ], room),
      createDaySchedule('Monday', [
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Economics', teacher: teachers.economics },
        { subject: 'Geography & Environment', teacher: teachers.geography },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
        { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 1' },
      ], room),
      createDaySchedule('Tuesday', [
        { subject: 'Economics', teacher: teachers.economics },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Civics & Citizenship', teacher: teachers.civics },
        { subject: 'History of Bangladesh', teacher: teachers.history },
        { subject: 'English 2nd Paper', teacher: teachers.english },
        { subject: 'Religious Studies', teacher: teachers.religion },
      ], room),
      createDaySchedule('Wednesday', [
        { subject: 'History of Bangladesh', teacher: teachers.history },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'Geography (Map Work & Lab)', teacher: teachers.geography, room: 'Geography Lab' },
        { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
        { subject: 'English 1st Paper', teacher: teachers.english },
        { subject: 'Civics & Constitutional Law', teacher: teachers.civics },
      ], room),
      createDaySchedule('Thursday', [
        { subject: 'Geography & Environment', teacher: teachers.geography },
        { subject: 'History of World Civilization', teacher: teachers.history },
        { subject: 'Economics (Macro & Micro)', teacher: teachers.economics },
        { subject: 'General Mathematics', teacher: teachers.generalMath },
        { subject: 'General Science', teacher: teachers.generalScience },
        { subject: 'Weekly Creative Writing Assessment', teacher: teachers.civics },
      ], room),
    ];
  }

  // Section A (Default)
  const teachers = {
    history: 'Dr. Afzal Hossain',
    geography: 'Ms. Laila Arjumand',
    civics: 'Mr. Badrul Alam',
    economics: 'Mr. Zahirul Haque',
    generalScience: 'Dr. Tanvir Ahmed',
    generalMath: 'Mr. Jahangir Kabir',
    bangla: 'Dr. Shah Alam',
    english: 'Ms. Rebecca Sultana',
    ict: 'Engr. Mahfuzur Rahman',
    religion: 'Ustadh Kamal Uddin',
  };

  return [
    createDaySchedule('Sunday', [
      { subject: 'History of Bangladesh & World Civ', teacher: teachers.history },
      { subject: 'Geography & Environment', teacher: teachers.geography },
      { subject: 'Civics & Citizenship', teacher: teachers.civics },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'English 1st Paper', teacher: teachers.english },
      { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
    ], room),
    createDaySchedule('Monday', [
      { subject: 'Geography & Environment', teacher: teachers.geography },
      { subject: 'Economics', teacher: teachers.economics },
      { subject: 'General Science', teacher: teachers.generalScience },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'Bangla 2nd Paper', teacher: teachers.bangla },
      { subject: 'Information & Tech (ICT)', teacher: teachers.ict, room: 'Computer Lab 1' },
    ], room),
    createDaySchedule('Tuesday', [
      { subject: 'Civics & Citizenship', teacher: teachers.civics },
      { subject: 'History of Bangladesh', teacher: teachers.history },
      { subject: 'Economics', teacher: teachers.economics },
      { subject: 'English 2nd Paper', teacher: teachers.english },
      { subject: 'General Science', teacher: teachers.generalScience },
      { subject: 'Religious Studies', teacher: teachers.religion },
    ], room),
    createDaySchedule('Wednesday', [
      { subject: 'History of Bangladesh', teacher: teachers.history },
      { subject: 'Geography (Map Work & Lab)', teacher: teachers.geography, room: 'Geography Lab' },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'English 1st Paper', teacher: teachers.english },
      { subject: 'Bangla 1st Paper', teacher: teachers.bangla },
      { subject: 'Civics & Constitutional Law', teacher: teachers.civics },
    ], room),
    createDaySchedule('Thursday', [
      { subject: 'Economics (Macro & Micro)', teacher: teachers.economics },
      { subject: 'History of World Civilization', teacher: teachers.history },
      { subject: 'Geography & Environment', teacher: teachers.geography },
      { subject: 'General Science', teacher: teachers.generalScience },
      { subject: 'General Mathematics', teacher: teachers.generalMath },
      { subject: 'Weekly Creative Writing Assessment', teacher: teachers.history },
    ], room),
  ];
};

/**
 * Main selector function to retrieve the static class routine with distinct Section A, B, and C schedules
 */
export function getClassRoutine(
  classId: string,
  group: string = 'Science',
  section: 'A' | 'B' | 'C' = 'A'
): ClassRoutineInfo {
  const num = parseInt(classId, 10) || 1;

  if (num <= 5) {
    const classTeachers: Record<'A' | 'B' | 'C', Record<number, string>> = {
      A: { 1: 'Ms. Salma Khatun', 2: 'Mr. Rafiqul Islam', 3: 'Mr. Hasan Mahmud', 4: 'Ms. Fahmida Yasmin', 5: 'Mr. Anwar Hossain' },
      B: { 1: 'Mr. Rafiqul Islam', 2: 'Ms. Fahmida Yasmin', 3: 'Ms. Salma Khatun', 4: 'Mr. Hasan Mahmud', 5: 'Moulana Habibur Rahman' },
      C: { 1: 'Ms. Fahmida Yasmin', 2: 'Ms. Salma Khatun', 3: 'Mr. Anwar Hossain', 4: 'Mr. Rafiqul Islam', 5: 'Ms. Nusrat Jahan' },
    };

    return {
      classId: String(num),
      className: `Class ${num}`,
      group: 'General',
      section,
      roomNumber: `Room 10${num}-${section}`,
      classTeacher: classTeachers[section]?.[num] || 'Class Faculty',
      schedule: generatePrimaryRoutine(String(num), section),
    };
  }

  if (num <= 8) {
    const classTeachers: Record<'A' | 'B' | 'C', Record<number, string>> = {
      A: { 6: 'Dr. Shah Alam', 7: 'Ms. Rebecca Sultana', 8: 'Mr. Jahangir Kabir' },
      B: { 6: 'Ms. Rebecca Sultana', 7: 'Dr. Tanvir Ahmed', 8: 'Mr. Moniruzzaman' },
      C: { 6: 'Mr. Moniruzzaman', 7: 'Dr. Shah Alam', 8: 'Ms. Parveen Begum' },
    };

    return {
      classId: String(num),
      className: `Class ${num}`,
      group: 'General',
      section,
      roomNumber: `Room 20${num}-${section}`,
      classTeacher: classTeachers[section]?.[num] || 'Junior Faculty',
      schedule: generateJuniorRoutine(String(num), section),
    };
  }

  // Class 9 & 10
  const normalizedGroup = group.toLowerCase();

  if (normalizedGroup.includes('commerce') || normalizedGroup.includes('business')) {
    const commerceTeachers = {
      A: 'Mr. Saiful Islam, FCMA',
      B: 'Ms. Shamima Akter',
      C: 'Mr. Mustafizur Rahman',
    };

    return {
      classId: String(num),
      className: `Class ${num}`,
      group: 'Commerce',
      section,
      roomNumber: `Room 31${num}-${section} (Commerce Wing)`,
      classTeacher: commerceTeachers[section] || 'Faculty Member',
      schedule: generateCommerceRoutine(String(num), section),
    };
  }

  if (normalizedGroup.includes('art') || normalizedGroup.includes('humanities')) {
    const artsTeachers = {
      A: 'Dr. Afzal Hossain',
      B: 'Ms. Laila Arjumand',
      C: 'Mr. Badrul Alam',
    };

    return {
      classId: String(num),
      className: `Class ${num}`,
      group: 'Arts',
      section,
      roomNumber: `Room 32${num}-${section} (Humanities Wing)`,
      classTeacher: artsTeachers[section] || 'Faculty Member',
      schedule: generateArtsRoutine(String(num), section),
    };
  }

  // Default to Science for Class 9 and 10
  const scienceTeachers = {
    A: 'Prof. Abdul Hannan',
    B: 'Dr. Nasiruddin Ahmed',
    C: 'Mr. Tariqul Islam',
  };

  return {
    classId: String(num),
    className: `Class ${num}`,
    group: 'Science',
    section,
    roomNumber: `Room 30${num}-${section} (Science Wing)`,
    classTeacher: scienceTeachers[section] || 'Science Faculty',
    schedule: generateScienceRoutine(String(num), section),
  };
}

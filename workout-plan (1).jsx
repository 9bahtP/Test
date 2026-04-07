import { useState } from "react";

// น้ำหนักดัมเบล: แกน ~1 กก./ข้าง
// แผ่น: 1.25 กก. × 4 แผ่น, 1 กก. × 4 แผ่น (ต่อดัมเบล 1 อัน)
// ตัวอย่างการจัด:
//   เบาสุด  = แกนเปล่า ~1 กก./ข้าง
//   เบา     = แกน + 1×2 = 3 กก./ข้าง
//   เบา+    = แกน + 1.25×2 = 3.5 กก./ข้าง
//   กลาง    = แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง  (หรือ แกน + 1.25×2 = 3.5 ถ้าแกน ~2)
//   กลาง+   = แกน + 1.25×2 + 1×2 = 5.5 กก./ข้าง
//   หนัก    = แกน + 1.25×4 = 6 กก./ข้าง
//   หนัก+   = แกน + 1.25×4 + 1×1 = 7 กก./ข้าง
//   หนักสุด = แกน + 1.25×4 + 1×2 = 8 กก./ข้าง

const plan = {
  profile: { height: 172, weight: "52–54", bmi: "~17.6", goal: "เพิ่มมวลกล้ามเนื้อ (Lean Bulk)" },
  equipment: ["ดัมเบล 1 คู่ (แกนปรับน้ำหนักได้)", "แผ่น 1.25 กก. × 4 แผ่น", "แผ่น 1 กก. × 4 แผ่น"],
  weightConfig: [
    { label: "เบาสุด", weight: "~1–2 กก./ข้าง", plates: "แกนเปล่า", color: "#555" },
    { label: "เบา", weight: "3 กก./ข้าง", plates: "แกน + 1กก.×2", color: "#2980b9" },
    { label: "เบา+", weight: "3.5 กก./ข้าง", plates: "แกน + 1.25กก.×2", color: "#2471a3" },
    { label: "กลาง", weight: "4.5 กก./ข้าง", plates: "แกน + 1.25กก.×2 + 1กก.×1", color: "#27ae60" },
    { label: "กลาง+", weight: "5.5 กก./ข้าง", plates: "แกน + 1.25กก.×2 + 1กก.×2", color: "#e67e22" },
    { label: "หนัก", weight: "6 กก./ข้าง", plates: "แกน + 1.25กก.×4", color: "#e74c3c" },
    { label: "หนัก+", weight: "7 กก./ข้าง", plates: "แกน + 1.25กก.×4 + 1กก.×1", color: "#c0392b" },
    { label: "หนักสุด", weight: "8 กก./ข้าง", plates: "แกน + 1.25กก.×4 + 1กก.×2", color: "#922b21" },
  ],
  principle: [
    { icon: "📈", title: "Progressive Overload", desc: "ทำครบ rep สูงสุดแล้ว → เพิ่มน้ำหนักหรือ rep ในสัปดาห์ถัดไป นี่คือกุญแจสำคัญในการตัวใหญ่ขึ้น" },
    { icon: "🍚", title: "กินให้พอ (Caloric Surplus)", desc: "น้ำหนักตัวคุณน้อยมาก ต้องกินเกิน TDEE ~200–300 kcal/วัน เน้นข้าว ไข่ นม เนื้อสัตว์ ถั่ว" },
    { icon: "🥚", title: "โปรตีนให้พอ", desc: "เป้าหมาย 1.6–2 กรัม/กก./วัน = 84–108 กรัม/วัน เช่น ไข่ 3 ฟอง + นม 2 แก้ว + เนื้อ 150 กรัม" },
    { icon: "😴", title: "นอนหลับ 7–9 ชั่วโมง", desc: "กล้ามเนื้อโตตอนนอน ไม่ใช่ตอนออกกำลังกาย อย่าข้ามขั้นตอนนี้" },
    { icon: "🔁", title: "Deload ทุก 4–6 สัปดาห์", desc: "ลดน้ำหนักลง 40–50% ออกปกติ 1 สัปดาห์ ให้ร่างกายฟื้นฟูเต็มที่" },
  ],
  days: [
    {
      day: "จันทร์",
      focus: "อก + ไหล่ + ไทรเซ็ป",
      tag: "PUSH",
      color: "#e74c3c",
      exercises: [
        {
          name: "Dumbbell Floor Press",
          sets: "4", reps: "8–12", rest: "90 วิ", muscle: "อก",
          note: "นอนราบพื้น งอเข่า ดัมเบลลดถึงพื้น ดันขึ้นตรง",
          weightLabel: "กลาง → หนัก",
          weightDetail: "เริ่ม: แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\nเมื่อแข็งแกร่งขึ้น: แกน + 1.25×4 = 6 กก./ข้าง",
          weightColor: "#e67e22"
        },
        {
          name: "Dumbbell Fly (Floor)",
          sets: "3", reps: "12–15", rest: "60 วิ", muscle: "อก",
          note: "กางแขนออกช้าๆ รู้สึกยืดหน้าอก",
          weightLabel: "เบา → กลาง",
          weightDetail: "เริ่ม: แกน + 1กก.×2 = 3 กก./ข้าง\nเพิ่มได้: แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง",
          weightColor: "#2980b9"
        },
        {
          name: "Standing DB Shoulder Press",
          sets: "4", reps: "8–12", rest: "90 วิ", muscle: "ไหล่",
          note: "ยืนตรง core แน่น กดดัมเบลขึ้นเหนือหัว",
          weightLabel: "กลาง",
          weightDetail: "แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\n(ปรับเป็น 3.5 กก. ถ้ายังหนักเกินไป)",
          weightColor: "#27ae60"
        },
        {
          name: "DB Lateral Raise",
          sets: "3", reps: "12–15", rest: "60 วิ", muscle: "ไหล่กลาง",
          note: "ยกแขนออกข้างๆ ข้อศอกงอเล็กน้อย อย่าโยก",
          weightLabel: "เบา",
          weightDetail: "แกน + 1กก.×2 = 3 กก./ข้าง\n(ท่านี้เบาพอ ฟอร์มสำคัญกว่าน้ำหนัก)",
          weightColor: "#2980b9"
        },
        {
          name: "DB Overhead Tricep Extension",
          sets: "3", reps: "10–15", rest: "60 วิ", muscle: "ไทรเซ็ป",
          note: "จับดัมเบล 1 อัน ยกเหนือหัว งอข้อศอกลงหลัง",
          weightLabel: "เบา → กลาง",
          weightDetail: "จับ 1 ดัมเบล: ใส่แผ่น 1.25×2 + 1×1 = รวม ~6 กก.\nหรือเริ่มที่ 1.25×2 + 1×2 = รวม ~7 กก.",
          weightColor: "#2980b9"
        },
        {
          name: "Diamond Push-Up",
          sets: "3", reps: "Max", rest: "60 วิ", muscle: "อก+ไทรเซ็ป",
          note: "ถ้าเริ่มต้น ทำ push-up ปกติก่อนได้ เพิ่มความยากเมื่อพร้อม",
          weightLabel: "น้ำหนักตัว",
          weightDetail: "ไม่ต้องใช้ดัมเบล\nเพิ่มความท้าทาย: ยกเท้าพิงเก้าอี้",
          weightColor: "#555"
        },
      ]
    },
    {
      day: "อังคาร",
      focus: "หลัง + ไบเซ็ป",
      tag: "PULL",
      color: "#2980b9",
      exercises: [
        {
          name: "DB Bent-Over Row (Two Arms)",
          sets: "4", reps: "8–12", rest: "90 วิ", muscle: "หลังกลาง+ล่าง",
          note: "โน้มตัวไปข้างหน้า 45°, ดึงดัมเบลขึ้นชิดสีข้าง",
          weightLabel: "กลาง → หนัก",
          weightDetail: "เริ่ม: แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\nเพิ่มได้: แกน + 1.25×4 = 6 กก./ข้าง",
          weightColor: "#e67e22"
        },
        {
          name: "DB Single-Arm Row",
          sets: "3", reps: "10–12/ข้าง", rest: "60 วิ", muscle: "หลัง+ไบเซ็ป",
          note: "วางมือและเข่าข้างนึงบนเก้าอี้ ดึงขึ้นให้ข้อศอกชี้ฟ้า",
          weightLabel: "กลาง → หนัก",
          weightDetail: "เริ่ม: แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\nเพิ่มได้: แกน + 1.25×4 = 6 กก./ข้าง",
          weightColor: "#e67e22"
        },
        {
          name: "DB Rear Delt Fly",
          sets: "3", reps: "12–15", rest: "60 วิ", muscle: "ไหล่หลัง",
          note: "โน้มตัว 90° กางแขนออกข้างๆ เหมือนนก",
          weightLabel: "เบา",
          weightDetail: "แกน + 1กก.×2 = 3 กก./ข้าง\n(เบาพอ ฟอร์มสำคัญกว่า)",
          weightColor: "#2980b9"
        },
        {
          name: "DB Bicep Curl",
          sets: "4", reps: "10–15", rest: "60 วิ", muscle: "ไบเซ็ป",
          note: "ยืนตรง หมุนข้อมือขึ้นบน (supinate) ตอนยก",
          weightLabel: "กลาง",
          weightDetail: "แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\n(ปรับเป็น 3.5 กก. ถ้าฟอร์มยังไม่นิ่ง)",
          weightColor: "#27ae60"
        },
        {
          name: "DB Hammer Curl",
          sets: "3", reps: "10–15", rest: "60 วิ", muscle: "ไบเซ็ป+แขนท่อน",
          note: "จับดัมเบลแนวตั้ง (นิ้วโป้งชี้ฟ้า) เหมือนถือค้อน",
          weightLabel: "กลาง",
          weightDetail: "แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\nหรือ แกน + 1.25×2 + 1×2 = 5.5 กก./ข้าง",
          weightColor: "#27ae60"
        },
        {
          name: "Plank",
          sets: "3", reps: "30–60 วิ", rest: "45 วิ", muscle: "Core",
          note: "ลำตัวตรง ไม่ยกก้น ไม่ห่อไหล่",
          weightLabel: "น้ำหนักตัว",
          weightDetail: "ไม่ต้องใช้ดัมเบล\nเพิ่มความท้าทาย: วางดัมเบลบนหลัง",
          weightColor: "#555"
        },
      ]
    },
    {
      day: "พฤหัสบดี",
      focus: "ขา + กล้ามเนื้อหลัก",
      tag: "LEGS",
      color: "#27ae60",
      exercises: [
        {
          name: "DB Goblet Squat",
          sets: "4", reps: "10–15", rest: "90 วิ", muscle: "ต้นขา+ก้น",
          note: "จับดัมเบล 1 อันไว้หน้าอก นั่งลงให้ต้นขาขนานพื้น เข่าไม่เกินปลายเท้า",
          weightLabel: "หนัก",
          weightDetail: "จับ 1 ดัมเบล ใส่เต็ม: 1.25×4 + 1×2 = รวม ~9 กก.\n(ขาแข็งแรงกว่าแขน ใช้หนักได้)",
          weightColor: "#e74c3c"
        },
        {
          name: "DB Romanian Deadlift",
          sets: "4", reps: "10–12", rest: "90 วิ", muscle: "หลังต้นขา+หลังล่าง",
          note: "ยืนตรง ค่อยๆ โน้มตัวไปข้างหน้า ดัมเบลลากลงตามขา รู้สึกยืดกล้ามเนื้อหลังขา",
          weightLabel: "กลาง → หนัก",
          weightDetail: "เริ่ม: แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\nเพิ่มได้: แกน + 1.25×4 = 6 กก./ข้าง",
          weightColor: "#e67e22"
        },
        {
          name: "DB Bulgarian Split Squat",
          sets: "3", reps: "8–10/ข้าง", rest: "90 วิ", muscle: "ต้นขา+ก้น",
          note: "วางเท้าหลังบนเก้าอี้ย่อตัวลง ท้าทายมาก แต่ได้ผลดีมาก",
          weightLabel: "เบา → กลาง",
          weightDetail: "เริ่ม: แกน + 1.25×2 = 3.5 กก./ข้าง\nเพิ่มได้: แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง",
          weightColor: "#2980b9"
        },
        {
          name: "DB Calf Raise",
          sets: "3", reps: "15–20", rest: "45 วิ", muscle: "น่อง",
          note: "ยืนปลายเท้าบนขั้นบันไดหรือหนังสือหนาๆ เพื่อ range of motion เต็มที่",
          weightLabel: "หนัก (ถือดัมเบล)",
          weightDetail: "ถือ 1 ดัมเบล/มือ: แกน + 1.25×4 = 6 กก./ข้าง\nหรือ ถือ 1 อัน ใส่เต็ม ~9 กก.",
          weightColor: "#e74c3c"
        },
        {
          name: "Glute Bridge",
          sets: "3", reps: "15–20", rest: "60 วิ", muscle: "ก้น+หลังต้นขา",
          note: "วางดัมเบลบนสะโพก ยกก้นขึ้นค้างไว้ 1 วิ",
          weightLabel: "กลาง → หนัก",
          weightDetail: "วาง 1 ดัมเบลบนสะโพก:\nเริ่ม: ใส่ 1.25×4 = รวม ~6 กก.\nเพิ่มได้: ใส่เต็ม 1.25×4 + 1×2 = รวม ~9 กก.",
          weightColor: "#e67e22"
        },
        {
          name: "Dead Bug",
          sets: "3", reps: "8–10/ข้าง", rest: "45 วิ", muscle: "Core",
          note: "นอนหงาย ยกแขนขาออกสลับข้าง ลำตัวแนบพื้นตลอด",
          weightLabel: "น้ำหนักตัว",
          weightDetail: "ไม่ต้องใช้ดัมเบล\nเพิ่มความท้าทาย: ถือดัมเบลเบา 1.25–2 กก./มือ",
          weightColor: "#555"
        },
      ]
    },
    {
      day: "ศุกร์",
      focus: "อก + ไหล่ (Volume)",
      tag: "PUSH+",
      color: "#8e44ad",
      exercises: [
        {
          name: "DB Incline Floor Press (ใช้หมอน/กระเป๋า)",
          sets: "4", reps: "8–12", rest: "90 วิ", muscle: "อกบน",
          note: "หนุนหลังสูงขึ้น 30–45° ดันขึ้นเน้นอกบน",
          weightLabel: "กลาง → หนัก",
          weightDetail: "เริ่ม: แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\nเพิ่มได้: แกน + 1.25×4 = 6 กก./ข้าง",
          weightColor: "#e67e22"
        },
        {
          name: "DB Chest Fly (Floor)",
          sets: "3", reps: "12–15", rest: "60 วิ", muscle: "อก",
          note: "เน้น stretch ยืดกว้าง ควบคุมตอนลงช้าๆ",
          weightLabel: "เบา → กลาง",
          weightDetail: "เริ่ม: แกน + 1กก.×2 = 3 กก./ข้าง\nเพิ่มได้: แกน + 1.25×2 = 3.5 กก./ข้าง",
          weightColor: "#2980b9"
        },
        {
          name: "Arnold Press",
          sets: "4", reps: "10–12", rest: "90 วิ", muscle: "ไหล่รอบด้าน",
          note: "เริ่มฝ่ามือหันเข้าหาตัว หมุนออกขณะดันขึ้น ได้ใช้ไหล่ทุกมัด",
          weightLabel: "กลาง",
          weightDetail: "แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\n(ท่าซับซ้อน เบาดีกว่าหนักแล้วฟอร์มพัง)",
          weightColor: "#27ae60"
        },
        {
          name: "DB Front Raise",
          sets: "3", reps: "12–15", rest: "60 วิ", muscle: "ไหล่หน้า",
          note: "ยกดัมเบลขึ้นข้างหน้าถึงระดับไหล่ สลับซ้าย-ขวา",
          weightLabel: "เบา",
          weightDetail: "แกน + 1.25×2 = 3.5 กก./ข้าง\n(ไหล่หน้าล้าง่าย ไม่ต้องหนัก)",
          weightColor: "#2980b9"
        },
        {
          name: "Close-Grip Push-Up",
          sets: "3", reps: "Max", rest: "60 วิ", muscle: "ไทรเซ็ป+อก",
          note: "มือชิดกัน กระตุ้นไทรเซ็ปมากขึ้น",
          weightLabel: "น้ำหนักตัว",
          weightDetail: "ไม่ต้องใช้ดัมเบล\nเพิ่มความท้าทาย: วางเท้าบนเก้าอี้",
          weightColor: "#555"
        },
        {
          name: "DB Shrug",
          sets: "3", reps: "15–20", rest: "45 วิ", muscle: "Trapezius",
          note: "ยักไหล่ขึ้นสูงสุด ค้างไว้ 1 วิ แล้วปล่อยช้าๆ",
          weightLabel: "หนัก",
          weightDetail: "แกน + 1.25×4 = 6 กก./ข้าง\nหรือ แกน + 1.25×4 + 1×1 = 7 กก./ข้าง",
          weightColor: "#e74c3c"
        },
      ]
    },
    {
      day: "เสาร์",
      focus: "Full Body + Core",
      tag: "FULL",
      color: "#d35400",
      exercises: [
        {
          name: "DB Thruster (Squat + Press)",
          sets: "4", reps: "8–10", rest: "90 วิ", muscle: "ทั้งตัว",
          note: "ย่อตัวลง พอขึ้นมาดันดัมเบลขึ้นเหนือหัวเลย compound king!",
          weightLabel: "กลาง",
          weightDetail: "แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\n(ท่าหนักมากเพราะรวม squat+press)",
          weightColor: "#27ae60"
        },
        {
          name: "DB Renegade Row",
          sets: "3", reps: "6–8/ข้าง", rest: "90 วิ", muscle: "หลัง+core",
          note: "อยู่ท่า push-up position จับดัมเบล ดึงขึ้นสลับข้าง",
          weightLabel: "กลาง",
          weightDetail: "แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\n(ต้องแบก BW ด้วย เบาพอดี)",
          weightColor: "#27ae60"
        },
        {
          name: "DB Swing (Kettlebell style)",
          sets: "3", reps: "15–20", rest: "60 วิ", muscle: "ก้น+หลัง",
          note: "จับดัมเบลแนวตั้ง โยกตะโพก (hip hinge) ไม่ใช่หลัง",
          weightLabel: "กลาง → หนัก",
          weightDetail: "จับ 1 ดัมเบลสองมือ:\nเริ่ม: ใส่ 1.25×4 = รวม ~6 กก.\nเพิ่มได้: ใส่เต็ม 1.25×4 + 1×2 = รวม ~9 กก.",
          weightColor: "#e67e22"
        },
        {
          name: "DB Lunge (Walking/Static)",
          sets: "3", reps: "10/ข้าง", rest: "60 วิ", muscle: "ขา+ก้น",
          note: "ก้าวไปข้างหน้า ลงเข่าหลังเกือบแตะพื้น",
          weightLabel: "กลาง",
          weightDetail: "แกน + 1.25×2 + 1×1 = 4.5 กก./ข้าง\nเพิ่มได้: แกน + 1.25×2 + 1×2 = 5.5 กก./ข้าง",
          weightColor: "#27ae60"
        },
        {
          name: "Russian Twist",
          sets: "3", reps: "20", rest: "45 วิ", muscle: "Core+สีข้าง",
          note: "ถือดัมเบล 1 อัน หมุนลำตัวซ้าย-ขวา ยกเท้าลอยพื้น",
          weightLabel: "เบา",
          weightDetail: "ถือ 1 ดัมเบล: ใส่แค่ 1.25×2 = รวม ~3.5 กก.\nหรือ 1.25×2 + 1×1 = รวม ~5.5 กก.",
          weightColor: "#2980b9"
        },
        {
          name: "Superman Hold",
          sets: "3", reps: "10 × ค้าง 3 วิ", rest: "45 วิ", muscle: "หลังล่าง+ก้น",
          note: "นอนคว่ำ ยกแขน+ขาพร้อมกัน ค้างไว้",
          weightLabel: "น้ำหนักตัว",
          weightDetail: "ไม่ต้องใช้ดัมเบล\nเพิ่มความท้าทาย: ถือดัมเบลเบา 1.25 กก./มือ",
          weightColor: "#555"
        },
      ]
    },
  ],
  nutrition: [
    { meal: "เช้า", example: "ข้าวต้ม/ข้าวเหนียว + ไข่ดาว 2–3 ฟอง + นม 1 แก้ว", kcal: "~500–600 kcal" },
    { meal: "กลางวัน", example: "ข้าว 2 ทัพพี + เนื้อสัตว์ 150–200 กรัม + ผัก", kcal: "~600–700 kcal" },
    { meal: "บ่าย (Snack)", example: "นม 1 แก้ว + กล้วย 1–2 ลูก หรือ ขนมปัง + ไข่", kcal: "~300 kcal" },
    { meal: "เย็น", example: "ข้าว 2 ทัพพี + โปรตีน + ผัก", kcal: "~600–700 kcal" },
    { meal: "ก่อนนอน", example: "นม 1 แก้ว หรือ Greek Yogurt", kcal: "~150–200 kcal" },
  ],
  weeks: [
    { week: "สัปดาห์ 1–2", focus: "เรียนรู้ท่า", sets: "3 sets", reps: "ช่วงล่าง", note: "เน้นฟอร์มถูกต้อง ไม่ต้องหนักมาก" },
    { week: "สัปดาห์ 3–4", focus: "เพิ่ม Volume", sets: "4 sets", reps: "ช่วงกลาง", note: "เพิ่ม rep หรือ weight เล็กน้อย" },
    { week: "สัปดาห์ 5–6", focus: "Push Intensity", sets: "4–5 sets", reps: "ช่วงล่าง", note: "เพิ่มน้ำหนักเมื่อทำครบ rep" },
    { week: "สัปดาห์ 7", focus: "Deload Week", sets: "3 sets", reps: "50% น้ำหนัก", note: "พักฟื้น เตรียมพร้อมรอบใหม่" },
  ]
};

const tagColors = { PUSH: "#e74c3c", PULL: "#2980b9", LEGS: "#27ae60", "PUSH+": "#8e44ad", FULL: "#d35400" };

export default function WorkoutPlan() {
  const [activeDay, setActiveDay] = useState(0);
  const [tab, setTab] = useState("workout");
  const [checked, setChecked] = useState({});
  const [expandedEx, setExpandedEx] = useState({});

  const toggleCheck = (key) => setChecked(p => ({ ...p, [key]: !p[key] }));
  const toggleExpand = (key, e) => {
    e.stopPropagation();
    setExpandedEx(p => ({ ...p, [key]: !p[key] }));
  };
  const day = plan.days[activeDay];

  return (
    <div style={{ fontFamily: "'Sarabun', sans-serif", background: "#0d0d0d", minHeight: "100vh", color: "#f0f0f0", padding: "0 0 60px 0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "28px 20px 20px", borderBottom: "1px solid #222" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ background: "#e74c3c", borderRadius: 12, padding: "8px 14px", fontWeight: 800, fontSize: 22 }}>💪</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 0.5 }}>BULK UP PROGRAM</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>172cm · 52–54kg · 5 วัน/สัปดาห์ · Home Dumbbell</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["workout", "nutrition", "principle", "progress"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontFamily: "Sarabun",
                background: tab === t ? "#e74c3c" : "#1e1e1e", color: tab === t ? "#fff" : "#aaa", fontWeight: tab === t ? 700 : 400,
                transition: "all 0.2s"
              }}>
                {{ workout: "🏋️ ออกกำลังกาย", nutrition: "🍚 โภชนาการ", principle: "📌 หลักการ", progress: "📈 Progression" }[t]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>

        {/* WORKOUT TAB */}
        {tab === "workout" && (
          <div>
            {/* Day Selector */}
            <div style={{ display: "flex", gap: 8, padding: "16px 0", overflowX: "auto" }}>
              {plan.days.map((d, i) => (
                <button key={i} onClick={() => setActiveDay(i)} style={{
                  flexShrink: 0, padding: "10px 14px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: activeDay === i ? tagColors[d.tag] : "#1a1a1a",
                  color: "#fff", fontFamily: "Sarabun", transition: "all 0.2s"
                }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{d.day}</div>
                  <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{d.tag}</div>
                </button>
              ))}
            </div>

            {/* Day Header */}
            <div style={{ background: `linear-gradient(135deg, ${day.color}22, ${day.color}11)`, border: `1px solid ${day.color}44`, borderRadius: 16, padding: "16px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{day.day} — {day.tag}</div>
                  <div style={{ color: "#aaa", fontSize: 14, marginTop: 4 }}>🎯 {day.focus}</div>
                </div>
                <div style={{ background: day.color, borderRadius: 8, padding: "6px 12px", fontWeight: 700, fontSize: 13 }}>
                  {day.exercises.length} ท่า
                </div>
              </div>
            </div>

            {/* Exercises */}
            {day.exercises.map((ex, i) => {
              const key = `${activeDay}-${i}`;
              const done = checked[key];
              const expanded = expandedEx[key];
              return (
                <div key={i} style={{
                  background: done ? "#1a2a1a" : "#141414", border: `1px solid ${done ? "#27ae60" : "#222"}`,
                  borderRadius: 14, marginBottom: 10, cursor: "pointer", transition: "all 0.2s", overflow: "hidden"
                }}>
                  {/* Main row */}
                  <div onClick={() => toggleCheck(key)} style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{done ? "✅" : "⬜"}</span>
                          <span style={{ fontWeight: 700, fontSize: 15, color: done ? "#27ae60" : "#f0f0f0" }}>{ex.name}</span>
                        </div>
                        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {[`🔁 ${ex.sets} sets`, `📊 ${ex.reps} reps`, `⏱ ${ex.rest}`, `💪 ${ex.muscle}`].map((tag, ti) => (
                            <span key={ti} style={{ background: "#222", borderRadius: 6, padding: "3px 8px", fontSize: 12, color: "#bbb" }}>{tag}</span>
                          ))}
                        </div>
                        <div style={{ marginTop: 8, fontSize: 13, color: "#888", lineHeight: 1.5 }}>
                          📝 {ex.note}
                        </div>
                      </div>
                      {/* Weight badge */}
                      <div style={{ marginLeft: 10, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                        <div style={{ background: ex.weightColor + "33", border: `1px solid ${ex.weightColor}66`, borderRadius: 8, padding: "5px 10px", fontSize: 11, color: ex.weightColor, fontWeight: 700, textAlign: "center" }}>
                          🏋️ {ex.weightLabel}
                        </div>
                        <button
                          onClick={(e) => toggleExpand(key, e)}
                          style={{
                            background: "#1e1e1e", border: "1px solid #333", borderRadius: 6,
                            color: "#888", fontSize: 11, padding: "3px 8px", cursor: "pointer", fontFamily: "Sarabun"
                          }}
                        >
                          {expanded ? "▲ ซ่อน" : "▼ แผ่น"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded plate detail */}
                  {expanded && (
                    <div style={{
                      background: "#0d0d0d", borderTop: `1px solid ${ex.weightColor}44`,
                      padding: "12px 16px"
                    }}>
                      <div style={{ fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 700, letterSpacing: 0.5 }}>
                        ⚙️ การจัดแผ่นน้ำหนัก
                      </div>
                      {ex.weightDetail.split("\n").map((line, li) => (
                        <div key={li} style={{
                          fontSize: 13, color: li === 0 ? "#ddd" : "#aaa",
                          padding: "4px 0",
                          borderBottom: li < ex.weightDetail.split("\n").length - 1 ? "1px solid #1a1a1a" : "none",
                          display: "flex", alignItems: "center", gap: 8
                        }}>
                          <span style={{ color: ex.weightColor, flexShrink: 0 }}>{li === 0 ? "▶" : "→"}</span>
                          {line}
                        </div>
                      ))}
                      <div style={{ marginTop: 8, padding: "6px 10px", background: "#1a1a1a", borderRadius: 8, fontSize: 11, color: "#666" }}>
                        💡 แกนดัมเบล ≈ 1–2 กก./ข้าง · ขันน็อตให้แน่นทุกครั้ง
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ marginTop: 8, padding: "12px 16px", background: "#111", borderRadius: 12, fontSize: 13, color: "#666", textAlign: "center" }}>
              แตะที่ท่าเพื่อ ✅ · กด <b style={{ color: "#888" }}>▼ แผ่น</b> เพื่อดูการจัดน้ำหนัก
            </div>
          </div>
        )}

        {/* NUTRITION TAB */}
        {tab === "nutrition" && (
          <div style={{ paddingTop: 16 }}>
            <div style={{ background: "#1a1a1a", borderRadius: 16, padding: "16px 20px", marginBottom: 16, border: "1px solid #e74c3c44" }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#e74c3c", marginBottom: 8 }}>🎯 เป้าหมายโภชนาการ</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "แคลอรี่/วัน", value: "~2,400–2,600 kcal", icon: "🔥" },
                  { label: "โปรตีน/วัน", value: "84–108 กรัม", icon: "🥩" },
                  { label: "คาร์บ/วัน", value: "300–350 กรัม", icon: "🍚" },
                  { label: "ไขมัน/วัน", value: "60–80 กรัม", icon: "🥑" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#222", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 20 }}>{item.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{item.value}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>📋 แผนมื้ออาหาร</div>
            {plan.nutrition.map((m, i) => (
              <div key={i} style={{ background: "#141414", border: "1px solid #222", borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>🍽 {m.meal}</div>
                  <div style={{ background: "#27ae60", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{m.kcal}</div>
                </div>
                <div style={{ fontSize: 14, color: "#aaa", lineHeight: 1.6 }}>{m.example}</div>
              </div>
            ))}

            <div style={{ background: "#1a1505", border: "1px solid #f39c1244", borderRadius: 14, padding: "14px 16px", marginTop: 8 }}>
              <div style={{ fontWeight: 700, color: "#f39c12", marginBottom: 8 }}>⚡ Tips สำหรับคนผอม</div>
              {[
                "กินก่อนนอน 1–2 ชั่วโมง ช่วยสร้างกล้ามเนื้อระหว่างนอนหลับ",
                "ถ้าไม่หิว ลองดื่ม Mass Gainer หรือนมพร่องมันเนยแทน",
                "ข้าวเหนียวให้แคลอรี่สูงกว่าข้าวขาว ดีสำหรับ bulk",
                "กล้วยหอมทอง 1 ลูก = ~90 kcal เป็น snack ที่ดีมาก",
                "ติดตามน้ำหนักทุกเช้าหลังตื่นนอน ถ้าไม่ขึ้นใน 2 สัปดาห์ ให้เพิ่มแคลอรี่",
              ].map((tip, i) => (
                <div key={i} style={{ fontSize: 13, color: "#ccc", padding: "4px 0", borderBottom: "1px solid #2a2000", display: "flex", gap: 8 }}>
                  <span style={{ color: "#f39c12", flexShrink: 0 }}>→</span> {tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRINCIPLE TAB */}
        {tab === "principle" && (
          <div style={{ paddingTop: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>🔑 หลักการสำคัญที่ต้องรู้</div>
            {plan.principle.map((p, i) => (
              <div key={i} style={{ background: "#141414", border: "1px solid #222", borderRadius: 14, padding: "16px", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7 }}>{p.desc}</div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ fontWeight: 700, fontSize: 15, margin: "20px 0 12px" }}>🎚 ตารางน้ำหนักดัมเบล (ต่อข้าง)</div>
            {plan.weightConfig.map((w, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", background: i % 2 === 0 ? "#141414" : "#111",
                borderRadius: 8, marginBottom: 4, borderLeft: `3px solid ${w.color}`
              }}>
                <div>
                  <span style={{ fontSize: 14, color: w.color, fontWeight: 700 }}>{w.label}</span>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{w.plates}</div>
                </div>
                <span style={{ fontWeight: 800, fontSize: 15, color: w.color }}>{w.weight}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: "10px 14px", background: "#111", borderRadius: 8, fontSize: 12, color: "#555" }}>
              * แกนดัมเบลทั่วไป ≈ 1–2 กก./ข้าง · ขันน็อตล็อคให้แน่นทุกครั้ง
            </div>

            <div style={{ marginTop: 20, background: "#0a1628", border: "1px solid #2980b944", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, color: "#2980b9", marginBottom: 8 }}>🔄 วงรอบการออกกำลังกาย</div>
              <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.8 }}>
                วัน จ→อ→พัก→พฤ→ศ→ส→อาทิตย์พัก<br/>
                <span style={{ color: "#e74c3c" }}>Push</span> (จ, ศ) → <span style={{ color: "#2980b9" }}>Pull</span> (อ) → <span style={{ color: "#27ae60" }}>Legs</span> (พฤ) → <span style={{ color: "#d35400" }}>Full</span> (ส)<br/>
                กล้ามเนื้อแต่ละกลุ่มได้พัก 48–72 ชั่วโมงก่อนใช้งานซ้ำ ✅
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS TAB */}
        {tab === "progress" && (
          <div style={{ paddingTop: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📅 แผนการ Progression 8 สัปดาห์</div>
            {plan.weeks.map((w, i) => (
              <div key={i} style={{ background: "#141414", border: "1px solid #333", borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ background: ["#e74c3c", "#e67e22", "#27ae60", "#2980b9"][i], borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0, textAlign: "center", minWidth: 70 }}>
                  {w.week.split("–")[0]}<br/>
                  <span style={{ fontSize: 10, opacity: 0.8 }}>{w.week.includes("–") ? "–" + w.week.split("–")[1] : ""}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{w.focus}</div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{w.sets} · {w.reps}</div>
                  <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>{w.note}</div>
                </div>
              </div>
            ))}

            <div style={{ background: "#1a1a1a", borderRadius: 14, padding: "16px", marginTop: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📊 เป้าหมายที่สมจริง</div>
              {[
                { time: "1 เดือน", goal: "น้ำหนักขึ้น 0.5–1 กก., รู้สึกแข็งแรงขึ้นชัดเจน, ฟอร์มดีขึ้น" },
                { time: "3 เดือน", goal: "น้ำหนักขึ้น 2–3 กก., กล้ามเนื้อเริ่มมีนูนให้เห็น" },
                { time: "6 เดือน", goal: "น้ำหนักขึ้น 4–6 กก., รูปร่างเปลี่ยนแปลงอย่างชัดเจน" },
                { time: "1 ปี", goal: "ตัวใหญ่ขึ้น มีกล้ามเนื้อ น้ำหนักอาจถึง 60+ กก." },
              ].map((g, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #222" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#e74c3c", flexShrink: 0, minWidth: 65 }}>{g.time}</div>
                  <div style={{ fontSize: 13, color: "#bbb" }}>{g.goal}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, background: "#0d1a0d", border: "1px solid #27ae6044", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, color: "#27ae60", marginBottom: 8 }}>✅ สัญญาณว่าโปรแกรมได้ผล</div>
              {["น้ำหนักขึ้น 0.5–1 กก./เดือน", "ทำ rep ได้มากขึ้น หรือ weight เพิ่มขึ้น", "กล้ามเนื้อเริ่มแน่นและมีรูปร่าง", "รู้สึกแข็งแรงขึ้นในชีวิตประจำวัน"].map((s, i) => (
                <div key={i} style={{ fontSize: 13, color: "#aaa", padding: "4px 0", display: "flex", gap: 8 }}>
                  <span style={{ color: "#27ae60" }}>✓</span> {s}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Firebase: บันทึกสีเส้นข้างที่เลือกโดยแอดมิน
export const saveBorderColorToFirebase = async (color: string) => {
  await fetch('https://kovfs-a8152-default-rtdb.firebaseio.com/borderColor.json', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(color),
  });
};

// Firebase: ดึงสีเส้นข้างที่เลือกโดยแอดมิน
export const fetchBorderColorFromFirebase = async (): Promise<string> => {
  const res = await fetch('https://kovfs-a8152-default-rtdb.firebaseio.com/borderColor.json');
  const color = await res.json();
  return color || 'border-l-green-500 dark:border-l-green-400';
};

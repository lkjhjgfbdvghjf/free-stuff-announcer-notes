// Firebase: ดึงสี headerBorderColor ที่เลือกโดยแอดมิน
export const fetchHeaderBorderColorFromFirebase = async (): Promise<string> => {
  const res = await fetch('https://kovfs-a8152-default-rtdb.firebaseio.com/headerBorderColor.json');
  const color = await res.json();
  return color || 'border-green-500 dark:border-green-400';
};

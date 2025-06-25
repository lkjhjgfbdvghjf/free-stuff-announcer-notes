// Firebase: save and fetch title gradient color
export const saveTitleColorToFirebase = async (color) => {
  await fetch('https://kovfs-a8152-default-rtdb.firebaseio.com/titleColor.json', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(color),
  });
};

export const fetchTitleColorFromFirebase = async () => {
  const res = await fetch('https://kovfs-a8152-default-rtdb.firebaseio.com/titleColor.json');
  const color = await res.json();
  return color || 'from-green-400 via-blue-500 to-purple-500';
};

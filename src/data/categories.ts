export const categories = [
  // مراقبت پوست صورت
  { value: 'cleanser', label: 'پاک‌کننده', group: 'مراقبت پوست صورت' },
  { value: 'serum', label: 'سرُم', group: 'مراقبت پوست صورت' },
  { value: 'cream', label: 'کرم', group: 'مراقبت پوست صورت' },
  { value: 'mask', label: 'ماسک صورت', group: 'مراقبت پوست صورت' },
  { value: 'sunscreen', label: 'ضد آفتاب', group: 'مراقبت پوست صورت' },
  { value: 'toner', label: 'تونر', group: 'مراقبت پوست صورت' },
  { value: 'eyecream', label: 'کرم دور چشم', group: 'مراقبت پوست صورت' },
  // مراقبت لب
  { value: 'lipbalm', label: 'بالم لب', group: 'مراقبت لب' },
  { value: 'lipmask', label: 'ماسک لب', group: 'مراقبت لب' },
  // مراقبت بدن
  { value: 'bodylotion', label: 'لوسیون بدن', group: 'مراقبت بدن' },
  // مراقبت مو
  { value: 'hairmask', label: 'ماسک مو', group: 'مراقبت مو' },
  { value: 'hairserum', label: 'سرم مو', group: 'مراقبت مو' },
  { value: 'hairoil', label: 'روغن مو', group: 'مراقبت مو' },
];

export const categoryLabel: Record<string, string> = Object.fromEntries(
  categories.map(c => [c.value, c.label])
);

export const categoryGroups = categories.reduce((acc, cat) => {
  if (!acc[cat.group]) acc[cat.group] = [];
  acc[cat.group].push(cat);
  return acc;
}, {} as Record<string, typeof categories>);
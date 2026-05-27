export default function Home() {
  return (
    <main
      className="flex flex-1 items-center justify-center"
      style={{ color: 'var(--fg-muted)' }}
    >
      <div className="flex flex-col items-center gap-2 text-sm tracking-widest">
        <p>請從左上方選擇書籍</p>
        <p>小說依故事年代排列</p>
        <p>上方列：小說字數計算、門派統計、字體縮放、明暗顯示</p>
        <p>評論會陸續增加</p>
      </div>
    </main>
  );
}

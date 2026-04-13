import './App.css'
function ArrayDisplay({ items, current, comparing }) {
  return (
    <table>
      <tbody>
        <tr>
          {items.map((item, i) => (
            <td
              key={i}
              className={
                current === i ? "current" :
                comparing.includes(i) ? "comparing" :
                ""
              }
            >
              {item}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default ArrayDisplay;

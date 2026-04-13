import { useState, useRef} from 'react'
import ArrayDisplay from './ArrayDisplay';
import './App.css'

function App() {
  //states n effects
  const [input, setInput] = useState("");
  const [argot, setArgot] = useState([]);
  const [current, setCurrent] = useState(null);
  const [comparing, setComparing] = useState([]);
  const genRef = useRef(null);
  //util functions
  function handleList(e){
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJS = Object.fromEntries(formData.entries());
    console.log(formJS);
    const meth = sorters[formJS.sort_method];
    genRef.current = (meth([...argot]));
  }

  function handleAdd(e){
    e.preventDefault();
    const num = parseInt(input, 10);
    if(isNaN(num)) return;
    setArgot([...argot, num]);
    setInput("")
  } 

  function handleStart() {
    if (!genRef.current) return;
    const interval = setInterval(() => {
      const { value, done } = genRef.current.next();
      console.log(value);
      if (done) { clearInterval(interval); setCurrent(null); setComparing([]); return; }
      setArgot(value.arr);
      setCurrent(value.current);
      setComparing(value.comparing ?? []);
    }, 300);
  }

  //sorting fucns 
  //using yield which works as a pausable (next-able??) return, so make a step yield then a setInterval during the run 
  function* bubbleSort(array){
    const len = array.length;
    for(let i = 0; i < len -1; i++){
      for(let j=0; j<len - i - 1; j++){
        yield{arr:[...array], current : i, comparing: [j, j+1]}
        if(array[j] > array[j+1]){
          [array[j], array[j+1]] = [array[j+1], array[j]];
          yield{arr:[...array], current:j, comparing: [j, j+1]}
        }
      }
    }
  }

  function* selectionSort(array){
    const len = array.length;
    for(let i=0; i<len - 1; i++){
      let min = i;
      yield{arr:[...array], current: min, comparing: []}
      for(let j=i+1; j<len; j++){
        if(array[min]>array[j]){
        yield{arr:[...array], current: min, comparing: [min, j]};
          min = j;
          yield{arr:[...array], current: [min], comparing: [min, j]};
        }
      }
      [array[i], array[min]] = [array[min], array[i]];
      yield{ arr: [...array], current: i, comparing: [] };
    }
  }

  function* insertionSort(array){
    const len = array.length;
    for(let i= 1; i<len; i++){
      let j = i;
      yield{arr:[...array], current:j, comparing:[]}
      while(j>0 && array[j-1] > array[j]){
        yield{arr:[...array], current:j, comparing:[j-1, j]};
        [array[j], array[j - 1]] = [array[j - 1], array[j]];
        j--;
        yield{arr:[...array], current:j, comparing:[j, j+1]};
      }
    }
  }
    function* mergeSort(array, l=0, r=array.length - 1){
      if(l >= r) return;
      let m = Math.floor((l+r)/2);
      yield* mergeSort(array, l, m);
      yield* mergeSort(array, m+1, r);
      yield* merge(array, l, m, r);
    }
    
    function* merge(arr, l, m, r){
      let L = arr.slice(l, m+1);
      let R = arr.slice(m+1, r+1);
      let i=0, j=0, k=l;

      while(i < L.length && j < R.length){
      yield { arr: [...arr], current: k, comparing: [l + i, m + 1 + j] };
        if (L[i] <= R[j]) {
          arr[k] = L[i]; i++;
        } else {
          arr[k] = R[j]; j++;  // you also had R[i] here, bug in your original
        }
        k++;
        yield { arr: [...arr], current: k, comparing: [] };
      }
      while (i < L.length) { arr[k] = L[i]; i++; k++; }
      while (j < R.length) { arr[k] = R[j]; j++; k++; }
      yield { arr: [...arr], current: null, comparing: [] };
      }
    
  
  function* heapify(array, n, i){
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if(l < n && array[l] > array[largest]){
      largest = l;
    }
    if(r < n && array[r] > array[largest]){
      largest = r;
    }

    if(largest != i){
      yield{ arr:[...array], current:i, comparing:[i, largest]};
      [array[i], array[largest]] = [array[largest], array[i]];
      yield{ arr:[...array], current:i, comparing:[]};
      yield* heapify(array, n, largest);
    }
  }
  
  function* heapSort(array){
  const n = array.length;
    for(let i= Math.floor(n/2) - 1; i>=0; i--){
      yield* heapify(array, n ,i)
    }

    for(let i=n-1; i>0; i--){
      yield{arr:[...array], current:0, comparing:[0, i]};
      [array[0], array[i]] = [array[i], array[0]];
      yield { arr: [...array], current: i, comparing: [] };
      yield* heapify(array, i, 0);
    }
  }

  const sorters = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  heap: heapSort,
  }


  return (
    <div>
    <div>
      <form onSubmit = {handleAdd}>
 <input
        type="number"
        value={input}
        onChange={p => setInput(p.target.value)}
      />
      <button type="submit"> Add </button>
      <button onClick={() => {setArgot([])}}> Reset </button>
      </form>
    </div>


    <div>
      <form onSubmit={handleList}>
        <label> Array Sorting Method 
          <select name="sort_method">
            <option value="bubble"> Bubble Sort</option>
            <option value="selection"> Selection Sort</option>  
            <option value="insertion"> Insertion Sort</option>
            <option value="merge"> Merge Sort</option>
            <option value="heap"> Heap Sort</option>
          </select>
        </label>
        <button type="submit"> Submit</button>
      </form>

      <button onClick={handleStart}> Sort </button>
    </div>

    <div>
        <ArrayDisplay items={argot} current={current} comparing={comparing}> </ArrayDisplay>
    </div>
    </div>
  )
}

export default App


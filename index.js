var array = [];
var arrButton = document.getElementById("arrayAdd");
var newElement = document.getElementById("arrayElement");
var tempEl = document.getElementById("temp");
var arraySpace = document.getElementById("output");
var arraytab = document.createElement("table");
var arrayRow = document.createElement("tr");

arrButton.addEventListener("click", ()=>{
   if(newElement.value !== "") {
       array.push(parseInt(newElement.value));
       output.value = array;
       var arrayCell = document.createElement("td");
       arrayCell.innerHTML = newElement.value;
       arrayRow.appendChild(arrayCell);

       arraytab.appendChild(arrayRow);
       arraySpace.appendChild(arraytab);
   }
});
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sortArray() {
    var sortPick = document.getElementById("sortSelect").value;
    
    if (sortPick == "bubble") {
        let len = array.length;
        let cells = arrayRow.children;

        for (let i = 0; i < len - 1; i++) {
            for (let j = 0; j < len - i - 1; j++) {
                cells[j].style.backgroundColor = "red";
                await delay(500);
                cells[j].style.backgroundColor = "";
                if (array[j] > array[j + 1]) {
                    // Swap values in the array
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];

                    // Update the table visually
                    cells[j].innerHTML = array[j];
                    cells[j + 1].innerHTML = array[j + 1];

                    // Add a slight highlight effect
                    cells[j].style.backgroundColor = "yellow";
                    cells[j + 1].style.backgroundColor = "yellow";

                    await delay(1000); // Delay for visualization

                    // Remove highlight effect
                    cells[j].style.backgroundColor = "";
                    cells[j + 1].style.backgroundColor = "";
                }

            }
        }
    }
    if (sortPick == "select") {
        let n = array.length;
        let cells = arrayRow.children;
        
        for(let i=0; i< n - 1; i++) {
            
            let min=i;

            document.getElementById('temp').innerHTML = '';
            
            for(let j=i+1; j<n; j++){
                if(array[j]<array[min]){
                    min = j;
                    document.getElementById('temp').innerHTML = 'Min in this loop is : ' + array[min];
                    delay(300)
                }
            }
            
            let temp = array[i];
            array[i]= array[min];
            array[min]=temp;
            await delay(1000);
            cells[i].innerHTML = array[i];
            cells[min].innerHTML = array[min];
            cells[i].style.backgroundColor = "green";
        }
    }
    if (sortPick == "insert") {
        let n = array.length;
        let cells = arrayRow.children;

        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;

            // Highlight the key cell
            cells[i].style.backgroundColor = "orange";
            await delay(500);

            while (j >= 0 && array[j] > key) {
                array[j + 1] = array[j];
                cells[j + 1].innerHTML = array[j];
                j--;

                await delay(500);
            }

            array[j + 1] = key;
            cells[j + 1].innerHTML = key;

            // Reset highlights
            for (let k = 0; k <= i; k++) {
                cells[k].style.backgroundColor = "";
            }

            await delay(500);
        }
    }

    if (sortPick == "merge") {
        async function mergeSort(arr, l, r) {
            if (l >= r) return;
            let m = Math.floor((l + r) / 2);
            await mergeSort(arr, l, m);
            await mergeSort(arr, m + 1, r);
            await merge(arr, l, m, r);
        }

        async function merge(arr, l, m, r) {
            let n1 = m - l + 1;
            let n2 = r - m;
            let L = arr.slice(l, m + 1);
            let R = arr.slice(m + 1, r + 1);

            let i = 0, j = 0, k = l;
            while (i < n1 && j < n2) {
                if (L[i] <= R[j]) {
                    arr[k] = L[i];
                    arrayRow.children[k].innerHTML = L[i];
                    i++;
                } else {
                    arr[k] = R[j];
                    arrayRow.children[k].innerHTML = R[j];
                    j++;
                }
                arrayRow.children[k].style.backgroundColor = "lightgreen";
                await delay(500);
                arrayRow.children[k].style.backgroundColor = "";
                k++;
            }
            while (i < n1) {
                arr[k] = L[i];
                arrayRow.children[k].innerHTML = L[i];
                arrayRow.children[k].style.backgroundColor = "lightgreen";
                await delay(500);
                arrayRow.children[k].style.backgroundColor = "";
                i++; k++;
            }
            while (j < n2) {
                arr[k] = R[j];
                arrayRow.children[k].innerHTML = R[j];
                arrayRow.children[k].style.backgroundColor = "lightgreen";
                await delay(500);
                arrayRow.children[k].style.backgroundColor = "";
                j++; k++;
            }
        }

        await mergeSort(array, 0, array.length - 1);
    }

    if (sortPick == "heap") {
        let n = array.length;
        let cells = arrayRow.children;

        async function heapify(n, i) {
            let largest = i;
            let l = 2 * i + 1;
            let r = 2 * i + 2;

            if (l < n && array[l] > array[largest])
                largest = l;

            if (r < n && array[r] > array[largest])
                largest = r;

            if (largest != i) {
                [array[i], array[largest]] = [array[largest], array[i]];
                cells[i].innerHTML = array[i];
                cells[largest].innerHTML = array[largest];
                cells[i].style.backgroundColor = "pink";
                cells[largest].style.backgroundColor = "pink";
                await delay(700);
                cells[i].style.backgroundColor = "";
                cells[largest].style.backgroundColor = "";

                await heapify(n, largest);
            }
        }

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await heapify(n, i);
        }

        // One by one extract elements
        for (let i = n - 1; i > 0; i--) {
            [array[0], array[i]] = [array[i], array[0]];
            cells[0].innerHTML = array[0];
            cells[i].innerHTML = array[i];
            cells[0].style.backgroundColor = "lightblue";
            cells[i].style.backgroundColor = "lightblue";
            await delay(700);
            cells[0].style.backgroundColor = "";
            cells[i].style.backgroundColor = "";

            await heapify(i, 0);
        }
    }
}
function resetArr() {
    let resetButton = document.getElementById("reset");
    array.pop()
    arrayRow.innerHTML = ""
    arraytab.removeChild(arrayRow)
    arraySpace.removeChild(arraytab)
    
}

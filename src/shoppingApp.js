import { useState, useEffect, useMemo } from "react";
export default function ShoppingApp() {
  const [food, setFood] = useState("");
  const [suggestedList, setSuggestedList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleChange = (e) => {
    setFood(e.target.value);
  };

  const handleItemSelection = (e) => {
    const selectedIdx = e.target.getAttribute("data-id");
    if (selectedIdx == null) {
      return;
    }
    setSelectedItems([
      ...selectedItems,
      {
        id: Date.now(),
        isDone: false,
        itemName: suggestedList[selectedIdx],
      },
    ]);
  };

  const handleDone = (id) => {
    setSelectedItems(
      selectedItems.map((item) => {
        if (item.id === id) {
          item.isDone = !item.isDone;
        }
        return item;
      })
    );
  };

  const handleCancel = (id) => {
    setSelectedItems(
      selectedItems.filter((item) => {
        return item.id != id;
      })
    );
  };

  const loadFoodSuggestions = async (food) => {
    try {
      let URL = `https://api.frontendeval.com/fake/food/${food}`;
      const response = await fetch(URL);
      if (response.status === 200) {
        const data = await response.json();
        setSuggestedList(data);
      }
    } catch (err) {
      alert("Not able to load the suggestions");
    }
  };

  let debouncedVersion = useMemo(() => debounce(loadFoodSuggestions, 1000), []);

  useEffect(() => {
    debouncedVersion(food);
  }, [food]);

  return (
    <>
      <h1> My Shopping List</h1>
      <input value={food} onChange={handleChange} />

      {food && !!suggestedList.length && (
        <div className="dropdown-suggestions" onClick={handleItemSelection}>
          {suggestedList.map((val, idx) => {
            return (
              <div data-id={idx} className="suggested-item">
                {val}
              </div>
            );
          })}
        </div>
      )}

      {selectedItems.map((shoppingItem) => {
        return (
          <div className="bucket-element">
            <button
              className="tick-icon"
              onClick={() => handleDone(shoppingItem.id)}
            >
              ✓
            </button>
            <div className={shoppingItem.isDone ? "item-completed" : ""}>
              {shoppingItem.itemName}
            </div>
            <button
              className="cancel-icon"
              onClick={() => handleCancel(shoppingItem.id)}
            >
              X
            </button>
          </div>
        );
      })}
    </>
  );
}

function debounce(fn, delay) {
  let timerID;
  return function (args) {
    if (timerID) clearTimeout(timerID);
    timerID = setTimeout(() => fn(args), delay);
  };
}

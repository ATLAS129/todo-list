import { useReducer, useState, useRef, useEffect } from "react";

let nextId = 1;

export default function App() {
  const inputRef = useRef(null);
  const [isEditingId, setIsEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [text, setText] = useState("");
  const [state, dispatch] = useReducer(tasksReducer, []);

  useEffect(() => {
    if (isEditingId != null) {
      inputRef.current.focus();
    }
  }, [isEditingId]);

  return (
    <div className="text-center">
      <h1 className="text-2xl">TODO LIST</h1>
      <div className="py-5 border">
        <form className="flex justify-center gap-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            className="border rounded-lg px-2 py-1"
          />
          <button
            className="border px-4 rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              dispatch({
                type: "added",
                id: nextId++,
                text: text,
              });
            }}
          >
            Add
          </button>
        </form>
      </div>
      <div>
        <ul>
          {state.map((el) => (
            <li key={el.id} className="p-5 border flex justify-between">
              <div className="flex gap-2 text-wrap">
                <input type="checkbox" className="peer" />
                {isEditingId === el.id ? (
                  <input
                    ref={inputRef}
                    value={editingText.length > 0 ? editingText : el.text}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="border rounded-lg px-2 py-1"
                  />
                ) : (
                  <span className="peer-checked:line-through peer-checked:opacity-70 text-wrap">
                    {el.text}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  className="px-3 rounded-lg border"
                  onClick={() => {
                    setIsEditingId((id) => (id !== el.id ? el.id : null));
                    if (isEditingId !== el.id) {
                      dispatch({
                        type: "changed",
                        task: {
                          id: isEditingId,
                          text: editingText,
                        },
                      });
                      setEditingText(el.text);
                    } else if (isEditingId === el.id) {
                      dispatch({
                        type: "changed",
                        task: {
                          id: isEditingId,
                          text: editingText,
                        },
                      });
                      setEditingText("");
                    }
                  }}
                >
                  {isEditingId !== el.id ? "Change" : "Apply"}
                </button>
                <button
                  className="px-3 text-white rounded-lg bg-red-500 hover:bg-red-800"
                  onClick={() =>
                    dispatch({
                      type: "deleted",
                      id: el.id,
                    })
                  }
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
        },
      ];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

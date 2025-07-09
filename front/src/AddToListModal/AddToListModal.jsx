import React, { Component } from "react";
import style from "./AddToListModal.module.css";

class AddToListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: -1,
      isCreatingNewList: false,
      newListName: "",
    };
  }

  handleSelectChange = (event) => {
    const value = event.target.value;

    if (value === "__new__") {
      this.setState({
        isCreatingNewList: true,
        selectedList: -1,
      });
    } else {
      this.setState({
        selectedList: value,
        isCreatingNewList: false,
        newListName: "",
      });
    }
  };

  handleNewListNameChange = (event) => {
    this.setState({ newListName: event.target.value });
  };

  handleSubmit = () => {
    const { movieID, movieTitle, onAdd, onClose } = this.props;
    const { isCreatingNewList, selectedList, newListName } = this.state;

    if (isCreatingNewList) onAdd(movieID, -1, newListName.trim());
    else onAdd(movieID, selectedList, "");
    onClose();

    this.setState({
      selectedList: "",
      isCreatingNewList: false,
      newListName: "",
    });
  };

  render() {
    const { isOpen, onClose, movieTitle, movieID, availableLists } = this.props;
    const { selectedList, isCreatingNewList, newListName } = this.state;

    if (!isOpen) return null;

    return (
      <div className={style["modal-overlay"]} onClick={onClose}>
        <div
          className={style["modal-content"]}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={style["close-button"]} onClick={onClose}>
            ×
          </button>

          <p className={style["modal-heading"]}>Add movie to list</p>
          <p className={style["modal-movie-title"]}>{movieTitle}</p>

          <select
            className={style["select-list"]}
            value={isCreatingNewList ? "__new__" : selectedList}
            onChange={this.handleSelectChange}
          >
            <option value="">Choose list</option>
            {availableLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
            <option value="__new__">New List</option>
          </select>

          {isCreatingNewList && (
            <div>
              <input
                type="text"
                className={style["new-list-name"]}
                value={newListName}
                onChange={this.handleNewListNameChange}
                placeholder="New list name"
              />
            </div>
          )}

          <button
            className={style["submit-button"]}
            onClick={this.handleSubmit}
            disabled={
              (!selectedList && !isCreatingNewList) ||
              (isCreatingNewList && newListName.trim() === "")
            }
          >
            Dodaj na listu
          </button>
        </div>
      </div>
    );
  }
}

export default AddToListModal;

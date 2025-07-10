import React, { Component } from "react";
import style from "./AddCriticModal.module.css";

class AddCriticModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCritic: -1,
      isCreatingNewCritic: false,
      newCriticName: "",
      rating: 0,
    };
  }

  handleSelectChange = (event) => {
    const value = event.target.value;

    if (value === "__new__") {
      this.setState({
        isCreatingNewCritic: true,
        selectedCritic: -1,
      });
    } else {
      this.setState({
        selectedCritic: value,
        isCreatingNewCritic: false,
        newCriticName: "",
      });
    }
  };

  handleNewCriticNameChange = (event) => {
    this.setState({ newCriticName: event.target.value });
  };

  handleRatingChange = (event) => {
    const value = parseFloat(event.target.value);
    this.setState({ rating: isNaN(value) ? 0 : value });
  };

  handleSubmit = () => {
    const { movieID, onAdd, onClose } = this.props;
    const { isCreatingNewCritic, selectedCritic, newCriticName, rating } =
      this.state;

    if (isCreatingNewCritic) {
      onAdd(movieID, -1, newCriticName.trim(), rating);
    } else {
      onAdd(movieID, selectedCritic, "", rating);
    }

    onClose();

    this.setState({
      selectedCritic: "",
      isCreatingNewCritic: false,
      newCriticName: "",
      rating: 0,
    });
  };

  render() {
    const { isOpen, onClose, movieTitle, availableCritics } = this.props;
    const { selectedCritic, isCreatingNewCritic, newCriticName, rating } =
      this.state;

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

          <p className={style["modal-heading"]}>Add critic</p>
          <p className={style["modal-movie-title"]}>{movieTitle}</p>

          <select
            className={style["select-list"]}
            value={isCreatingNewCritic ? "__new__" : selectedCritic}
            onChange={this.handleSelectChange}
          >
            <option value="">Choose critic</option>
            {availableCritics.map((critic) => (
              <option key={critic.id} value={critic.id}>
                {critic.name}
              </option>
            ))}
            <option value="__new__">New Critic</option>
          </select>

          {isCreatingNewCritic && (
            <div>
              <input
                type="text"
                className={style["new-list-name"]}
                value={newCriticName}
                onChange={this.handleNewCriticNameChange}
                placeholder="New critic name"
              />
            </div>
          )}

          <div>
            <input
              type="number"
              className={style["number-input"]}
              min="0"
              max="10"
              step="0.1"
              value={rating}
              onChange={this.handleRatingChange}
              placeholder="Rating"
            />
          </div>

          <button
            className={style["submit-button"]}
            onClick={this.handleSubmit}
            disabled={
              (!selectedCritic && !isCreatingNewCritic) ||
              (isCreatingNewCritic && newCriticName.trim() === "") ||
              rating <= 0
            }
          >
            Add critic
          </button>
        </div>
      </div>
    );
  }
}

export default AddCriticModal;

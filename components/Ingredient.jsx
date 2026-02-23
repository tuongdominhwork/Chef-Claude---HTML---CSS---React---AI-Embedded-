export default function Ingredient(props) {
    const listOfIngredient = props.ingredient.map(ingredientEl => {
        return (
            <li key={ingredientEl}>{ingredientEl}</li>
        )
    })
    return (
        <div className="list-of-ingredient-field">
            <h2>Ingredients on hand:</h2>
            <ul>
                {listOfIngredient}
            </ul>
        </div>
    )
}
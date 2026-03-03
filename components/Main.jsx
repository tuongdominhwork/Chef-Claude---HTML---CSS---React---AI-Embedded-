import React from "react"
import Ingredient from "./Ingredient"
import ClaudeRecipe from "./ClaudeRecipe"
import { getRecipeFromMistral } from "../ai"

export default function Main() {
    const [ingredient, setIngredient] = React.useState([])
    
    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient") 
        setIngredient(prevIngredient => {
            if (newIngredient != "") {
                return [...prevIngredient, newIngredient]
            } else {
                return prevIngredient
            }
        })
    }

    const [recipe, setRecipe] = React.useState("")
    const [recipeError, setRecipeError] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    async function getMistralRecipe() {
        if (isLoading) return

        setIsLoading(true)
        setRecipeError("")
        setRecipe("")
        try {
            const recipeMarkDown = await getRecipeFromMistral(ingredient)
            setRecipe(recipeMarkDown)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to generate recipe."
            setRecipe("")
            setRecipeError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }
    const recipeShow = React.useRef(null)
    React.useEffect(() => {
        if (recipe !== "" && recipeShow.current !== null) {
            recipeShow.current.scrollIntoView({behavior: "smooth"})
        }
    }, [recipe])
    return(
        <div>
            <form action={addIngredient}>
                <div className="input-field">
                    <input type="text" id="input" placeholder="e.g oregano" name="ingredient" />
                    <button id="btn" type="submit">+ Add ingredient</button>
                </div>
                {ingredient.length > 0 && <Ingredient ingredient={ingredient} />}
            </form>
            {ingredient.length > 3 && <div className="get-recipe-box">
                <div ref={ recipeShow } id="get-recipe-box-text">
                    <h4 id="get-recipe-box-title">Ready for a recipe?</h4>
                    <p>Generate a recipe from your list of ingredients</p>
                </div>
                <button
                    id="get-recipe-box-btn"
                    onClick={getMistralRecipe}
                    disabled={isLoading}
                >
                    {isLoading ? "Generating..." : "Get a recipe"}
                </button>
            </div>}
            {isLoading && (
                <div className="loading-recipe" aria-live="polite" aria-busy="true">
                    <span className="loading-dot" />
                    <p>Chef Claude is cooking up your recipe...</p>
                </div>
            )}
            {recipeError && <p>{recipeError}</p>}
            {recipe && <ClaudeRecipe recipe={recipe} />}
        </div>

    )
}

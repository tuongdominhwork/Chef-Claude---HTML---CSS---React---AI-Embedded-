import ReactMarkdown from "react-markdown"

export default function ClaudeRecipe(props) {
    return(
        <section className="suggested-recipe-container" aria-live="polite">
            <h2>Chef Claude Recommends:</h2>
            <div className="suggested-recipe-markdown">
                <ReactMarkdown>{props.recipe}</ReactMarkdown>
            </div>
        </section>
    )
}

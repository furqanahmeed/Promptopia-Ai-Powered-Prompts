import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const prompt = await Prompt.findById(params.id).populate("creator")
        if (!prompt) return new Response("Prompt Not Found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const { prompt, tag } = await request.json();

    try {
        await connectToDB();

        // Find the existing prompt by ID
        const existingPrompt = await Prompt.findById(params.id);

        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Update the prompt with new data
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response("Successfully updated the Prompts", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Prompt", { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        if (!params.id) {
            return new Response("Prompt ID is required", { status: 400 });
        }

        // First check if the prompt exists
        const prompt = await Prompt.findById(params.id);
        
        if (!prompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Delete the prompt
        const deletedPrompt = await Prompt.findByIdAndDelete(params.id);
        
        if (!deletedPrompt) {
            return new Response("Failed to delete prompt", { status: 500 });
        }

        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting prompt:", error);
        return new Response(JSON.stringify({ error: "Error deleting prompt", details: error.message }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
import BaseComponent from "./base-component"
import {projectState} from "../state/project-state"
import {autoBind} from "../decorators/autobind"
import {Validatable, validate} from "../util/validation"

export class ProjectInput extends BaseComponent<HTMLDivElement, HTMLFormElement> {

    title: HTMLInputElement;
    description: HTMLInputElement;
    people: HTMLInputElement;

    constructor() {

        super("project-input","app", true, "user-input")

        this.title = this.element.querySelector("#title") as HTMLInputElement;
        this.description = this.element.querySelector("#description") as HTMLInputElement;
        this.people = this.element.querySelector("#people") as HTMLInputElement;

        this.configure()
    }

        // abstract method
    renderContent () {}

    configure() {
        this.element.addEventListener("submit", this.submitForm)
    }

    private getUserInput(): [string, string, number] | void {

        const submittedTitle = this.title.value;
        const submittedDescription = this.description.value;
        const submittedNumberOfPeople = this.people.value;

        const titleValidatable: Validatable = {
            value: submittedTitle,
            required: true
        }

        const descriptionValidatable: Validatable = {
            value: submittedDescription,
            required: true,
            minLength: 4
        }

        const PeopleValidatable: Validatable = {
            value: +submittedNumberOfPeople,
            required: true,
            min: 1,
            max: 5
        }

        if (
            !validate(titleValidatable) || 
            !validate(descriptionValidatable) ||  
            !validate(PeopleValidatable) 
        ){
                alert("Invalid input, please try again!")
                return;
        } else {
            return [submittedTitle, submittedDescription, +submittedNumberOfPeople]
        }
    }

    private clearInputs() {
        this.title.value = "";
        this.description.value = "";
        this.people.value = "";

    }

    @autoBind
    private submitForm(event: Event) {
        event.preventDefault()
        // console.log(this.title.value);

        const userInput = this.getUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            // console.log(title, desc, people)
            projectState.addProject(title, desc, people)
            this.clearInputs()
        }

    }
}
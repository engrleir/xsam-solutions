const SolutionPreview = createClass({
    componentDidMount() {
        this.loadMathJax();
    },

    componentDidUpdate() {
        this.typeset();
    },

    loadMathJax() {
        if (window.MathJax) {
            this.typeset();
            return;
        }

        window.MathJax = {
            tex: {
                inlineMath: [
                    ['$', '$'],
                    ['\\(', '\\)']
                ],
                displayMath: [
                    ['$$', '$$'],
                    ['\\[', '\\]']
                ],
                processEscapes: true,
                processEnvironments: true
            },

            svg: {
                fontCache: 'global'
            }
        };

        const script = document.createElement('script');

        script.src =
            'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';

        script.async = true;

        script.onload = () => {
            this.typeset();
        };

        document.head.appendChild(script);
    },

    typeset() {
        if (!window.MathJax?.typesetPromise) {
            return;
        }

        const element = this.previewElement;

        if (!element) {
            return;
        }

        window.MathJax.typesetClear([element]);

        window.MathJax.typesetPromise([element]);
    },

    render() {
        const entry = this.props.entry;

        const questionId =
            entry.getIn(["data", "question_id"]);

        const questionText =
            entry.getIn(["data", "question_text"]);

        const categories =
            entry.getIn(["data", "categories"]);

        const body =
            this.props.widgetFor("body");

        return h(
            "div",
            {
                className: "solution-preview",
                ref: element => {
                    this.previewElement = element;
                }
            },

            h(
                "header",
                { className: "solution-header" },

                h(
                    "div",
                    { className: "eyebrow" },
                    "CIVIL ENGINEERING SOLUTION"
                ),

                h(
                    "h1",
                    null,
                    `Question #${questionId || ""}`
                ),

                h(
                    "div",
                    { className: "categories" },
                    categories &&
                    categories.map(category =>
                        h(
                            "span",
                            { className: "category" },
                            category
                        )
                    )
                )
            ),

            h(
                "section",
                { className: "question-card" },

                h(
                    "div",
                    { className: "section-label" },
                    "PROBLEM"
                ),

                h(
                    "div",
                    { className: "question-text" },
                    questionText
                )
            ),

            h(
                "section",
                { className: "solution-card" },

                h(
                    "div",
                    { className: "section-label" },
                    "SOLUTION"
                ),

                body
            )
        );
    }
});

CMS.registerPreviewTemplate(
    "solution",
    SolutionPreview
);

CMS.registerPreviewStyle(
    "/admin/preview.css"
);
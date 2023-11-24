const yup = require("yup");

// Yup schema for validation of incoming test data
const saveTestValidationSchema = yup.object({
    test_name: yup.string()
        .required('Required'),
    total_marks: yup.number()
        .integer('Total marks must not include a decimal point')
        .min(10, 'Test cannot be less than 10 marks')
        .max(500, 'Test cannot be more than 500 marks')
        .required('Required'),
    test_duration: yup.number()
        .integer('Test duration must not include a decimal point')
        .min(1, 'Duration cannot be less than 1 minute')
        .max(180, 'Duration cannot be more than 180 minutes')
        .required('Required'),
    test_pin: yup.number()
        .integer('Test pin must not include a decimal point')
        .required('Required'),
    questions: yup.array().of(
        yup.object({
            title: yup.string().required('Title required'),
            a: yup.string().required('Option A required'),
            b: yup.string().required('Option B required'),
            c: yup.string().required('Option C required'),
            d: yup.string().required('Option D required'),
            correct: yup.number()
                .integer('Option number must not include a decimal point')
                .min(1, 'Enter correct option number only (1,2,3,4)')
                .max(4, 'Enter correct option number only (1,2,3,4)')
                .required('Correct option required')
        })
    ).required('Questions required')
        .test('atleast-one-question-check', 'Please add questions!', arr => arr && arr.length !== 0)
})

module.exports = { saveTestValidationSchema }
// Question logic - EASY TO UPDATE!
// This is the format you should provide your questions in

const questionFlow = {
    start: {
        id: 'start',
        question: 'Are you 18 years old or older?',
        answers: [
            { text: 'Yes', next: 'citizenship' },
            { text: 'No', result: 'not-eligible-age' }
        ]
    },
    
    citizenship: {
        id: 'citizenship',
        question: 'Are you a UK, Irish, or eligible Commonwealth citizen?',
        answers: [
            { text: 'Yes', next: 'registered' },
            { text: 'No', result: 'not-eligible-citizenship' },
            { text: "I'm not sure", result: 'check-citizenship' }
        ]
    },
    
    registered: {
        id: 'registered',
        question: 'Are you registered to vote at your current address?',
        answers: [
            { text: 'Yes', next: 'photo-id' },
            { text: 'No', result: 'need-to-register' },
            { text: "I don't know", result: 'check-registration' }
        ]
    },
    
    'photo-id': {
        id: 'photo-id',
        question: 'Do you have an accepted form of photo ID?',
        answers: [
            { text: 'Yes', result: 'ready-to-vote' },
            { text: 'No', result: 'need-photo-id' },
            { text: "I'm not sure", result: 'check-photo-id' }
        ]
    }
};

// Results configuration
const results = {
    'ready-to-vote': {
        title: '✅ You\'re ready to vote!',
        message: 'Great news! You meet all the requirements and should be able to vote in the upcoming election. Make sure to bring your photo ID to the polling station.',
        type: 'success'
    },
    
    'not-eligible-age': {
        title: '❌ Not yet eligible',
        message: 'You must be 18 or older on polling day to vote. You can register from age 16, but you cannot vote until you turn 18.',
        type: 'error'
    },
    
    'not-eligible-citizenship': {
        title: '❌ Not eligible',
        message: 'Unfortunately, you must be a UK, Irish, or eligible Commonwealth citizen to vote in UK elections.',
        type: 'error'
    },
    
    'check-citizenship': {
        title: '⚠️ Check your eligibility',
        message: 'You need to verify if you are an eligible citizen. Check the Electoral Commission website for details about who can vote.',
        type: 'warning'
    },
    
    'need-to-register': {
        title: '⚠️ You need to register',
        message: 'You\'re not ready yet! You need to register to vote at your current address. You can register online at gov.uk/register-to-vote - it only takes 5 minutes.',
        type: 'warning'
    },
    
    'check-registration': {
        title: '⚠️ Check your registration',
        message: 'Contact your local electoral services team to find out if you\'re registered to vote. If not, you can register online at gov.uk/register-to-vote.',
        type: 'warning'
    },
    
    'need-photo-id': {
        title: '⚠️ You need photo ID',
        message: 'You\'re almost ready! You need an accepted form of photo ID to vote in person. This includes a UK passport, driving licence, or free Voter ID. Apply for free Voter ID at gov.uk/apply-for-photo-id-voter-authority-certificate.',
        type: 'warning'
    },
    
    'check-photo-id': {
        title: '⚠️ Check your photo ID',
        message: 'Make sure you have an accepted form of photo ID. Accepted forms include UK passport, driving licence, older person\'s bus pass, or free Voter ID.',
        type: 'warning'
    }
};

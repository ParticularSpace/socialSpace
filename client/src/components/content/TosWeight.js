import React from 'react';
import LoremIpsum from 'react-lorem-ipsum';



const bigLorem = () => {
    return LoremIpsum({
    p: 1,
    avgSentencesPerParagraph: 50,
    avgWordsPerSentence: 50,
})};

export function TosWeight() {
    return (
        <div>
            <h1 style={{fontWeight: 'bolder', fontSize: '40px', paddingBottom: '5%'}}>Terms Of Service</h1>
            <p style={{fontSize: '30px', paddingBottom: '5%'}}>By clicking "I agree" you agree to the terms of service and privacy policy.</p>
            <h2 style={{fontSize: '30px', paddingBottom: '5%'}}>Usage</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}<p style={{fontSize:'12px'}}><b><i><u>Don't do bad stuff.</u></i></b></p>{bigLorem()}</p>

            <h2 style={{fontSize: '30px', paddingBottom: '5%'}}>Privacy Policy</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}<p style={{fontSize:'12px'}}><b><i><u>You wont have any.</u></i></b></p>{bigLorem()}</p>

            <h2 style={{fontSize: '30px', paddingBottom: '5%'}}>Mumbo Jumbo</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}<p style={{fontSize:'12px'}}><b><i><u>Dont even attempt to understand this part.</u></i></b></p>{bigLorem()}</p>

            <h2 style={{fontSize: '30px', paddingBottom: '5%'}}>More Serious Legalities</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()} Customer service will remind you that you didnt read this part if you have any legitimite issues. {bigLorem()}</p>

            <h2 style={{fontSize: '30px', paddingBottom: '5%'}}>Milk, Eggs, Cookies</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}<p style={{fontSize:'12px'}}><b><i><u>Dont forget anything.</u></i></b></p>{bigLorem()}</p>

            <p style={{fontSize: '30px', paddingBottom: '5%'}}>Strictly Forbidden: Discussion of Jackie Chan 🚫🥋</p>
            <p style={{fontSize: '14px', paddingBottom: '5%'}}>At our organization, we uphold a professional and focused environment for all users. As much as we admire the talents of Jackie Chan, we must insist on a strict prohibition against any mention, discussion, or reference to this esteemed martial arts actor and his works. We kindly request all users to refrain from initiating conversations, making comparisons, or sharing content related to Jackie Chan within our services. This measure ensures that our platform remains dedicated to its intended purpose and avoids any potential distractions. Our commitment to excellence and maintaining a high standard of discourse compels us to enforce this rule diligently. Deviations from this policy may result in the removal of content, warnings, or, in severe cases, account suspensions. We sincerely appreciate your understanding and cooperation in respecting this restriction, as it contributes to fostering a professional and productive environment for all members of our community.</p>

            <h2 style={{fontSize: '30px', paddingBottom: '5%'}}>Privacy Policy</h2>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}<p style={{fontSize:'12px'}}><b><i><u>You wont have any.</u></i></b></p>{bigLorem()}</p>

            <p style={{fontSize: '30px', paddingBottom: '5%'}}>End User License Agreement</p>
            <p style={{fontSize: '5px', paddingBottom: '5%'}}>{bigLorem()}<p style={{fontSize:'12px'}}><b><i><u>By using the site, we now own all of your stuff.</u></i></b></p> {bigLorem()}</p>
        </div>
    );
}

export default TosWeight;
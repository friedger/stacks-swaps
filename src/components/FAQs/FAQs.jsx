// imports
import { Accordion } from 'react-bootstrap';
import faqs from './FAQs.json';

// @component FAQs
const FAQs = () => {
  console.log(faqs);
  return (
    <Accordion className="container">
      {faqs.map(({ question, answers }, index) => (
        <Accordion.Item eventKey={index.toString()}>
          <Accordion.Header>{question}</Accordion.Header>
          <Accordion.Body>
            {answers.map(answer => (
              <p dangerouslySetInnerHTML={{ __html: answer }}></p>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

// exports
export default FAQs;

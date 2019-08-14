import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';


import Api from '../../Model/Api';

import UserContext from '../../Contexts/UserContext';
import SpeakersContext from '../../Contexts/SpeakersContext';

import './Speakers.css';
import { stringify } from 'querystring';


const constants = {
  quoteMaxLength: 80
};

function QuoteForm(props) {
  const userContext = useContext(UserContext);
  const [content, setContent] = useState('');
  const onSubmit = async () => {
    if (content.length > 0) {
      await Api.addQuote(userContext.user, props.speaker, content);
      if (props.onSubmit) {
        props.onSubmit();
      }
      setContent('');
    }
  };
      
  return (
    <div>
      <div>
        <textarea className="textBox"
          name="quote"
          cols="100"
          rows="10"
          value={content}
          placeholder="Paste a New Quote"
          onChange={event => setContent(event.target.value)} />
      </div>
      <div>
        <button className="addButton" onClick={onSubmit}>Add</button>
      </div>
    </div>
  );
}

function Speaker(props) {
  const userContext = useContext(UserContext);
  const speakersContext = useContext(SpeakersContext);
  const speaker = speakersContext.list.find(speaker => speaker._id === props.match.params.id);

  const [quotes, setQuotes] = useState([]);
  const fetchQuotes = async () => {
    setQuotes(await Api.fetchQuotes(userContext.user, speaker));
  };
  
  useEffect(() => {
    if (speaker) {
      fetchQuotes();
    }
  }, [speaker]);

  const onDeleteQuote = async (quote) => {
    await Api.deleteQuote(userContext.user, speaker, quote);
    fetchQuotes();
  };
  const [personality, setPersonality] = useState(null);
  const fetchPersonality = async () => {
    const personality = await Api.fetchPersonality(userContext.user, speaker);
    setPersonality(personality);
  };
  useEffect(() => {
    if (speaker) {
      fetchPersonality();
    }
  }, [speaker]);
  const onCalculatePersonality = async () => {
    const nextPersonality = await Api.calculatePersonality(userContext.user, speaker);
    setPersonality(nextPersonality);
  };
  console.log(personality);
  
  return (
    <div className="Speaker">
      <h2>{speaker.name}</h2>
      <div>
        <button onClick={onCalculatePersonality}>Calculate personality</button>
      </div>
      {personality && 
        <div>
          <h3>Big 5</h3>
            {personality.traits.map(trait => {
              return (
                <div key={trait.traitId}>
                  {trait.name}: {(trait.percentile.toFixed(2))}
                </div>
              );
            })}

          {/* {personality.children.map(facet => {
            // console.log(trait.children)
            return (
              <div key={facet.facetTraitId}>
                {facet.facetName}: {facet.facetPercentile}
              </div>
            );
          })} */}
          <h3>Needs</h3>
            {personality.needs.map(trait => {
              return (
                <div key={trait.traitId}>
                  {trait.name}: {(trait.percentile.toFixed(2))}
                </div>
              );
            })}
          <h3>Values</h3>
            {personality.values.map(trait => {
              return (
                <div key={trait.traitId}>
                  {trait.name}: {(trait.percentile.toFixed(2))}
                </div>
              );
            })}
        </div>
      }
      <ul className="QuoteList" >
        {quotes.map(quote => {
          let content = quote.content;
          let isClipped = false;
          if (content.length > constants.quoteMaxLength) {
            content = content.slice(0, constants.quoteMaxLength);
            isClipped = true;
          }
          return (
            <li className="Quotes" key={quote.id}>
                <button className="Button" onClick={onDeleteQuote.bind(null, quote)}>Delete</button>
                {content}
                {isClipped && '...'}
              <hr className="QuoteSeparator"></hr>
            </li>
            );
          })}
      </ul>
      <QuoteForm speaker={speaker} onSubmit={fetchQuotes} />
    </div>
  );
}

export {Speaker as default};
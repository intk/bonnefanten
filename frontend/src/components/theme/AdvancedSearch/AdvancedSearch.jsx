/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Header } from 'semantic-ui-react';
import './AdvancedSearch.less';
import { Container } from 'semantic-ui-react';
import SelectFacet from './SelectFacet';
import { getVocabulary } from '@plone/volto/actions';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  zoeken: {
    id: 'zoeken',
    defaultMessage: 'Zoeken',
  },
  vervaardiger: {
    id: 'vervaardiger',
    defaultMessage: 'Vervaardiger',
  },
  Titel: {
    id: 'Titel',
    defaultMessage: 'Titel',
  },
  Objectnaam: {
    id: 'Objectnaam',
    defaultMessage: 'Objectnaam',
  },
  Materiaal: {
    id: 'Materiaal',
    defaultMessage: 'Materiaal',
  },
  Techniek: {
    id: 'Techniek',
    defaultMessage: 'Techniek',
  },
  Objectnummer: {
    id: 'Objectnummer',
    defaultMessage: 'Objectnummer',
  },
  Creditline: {
    id: 'Credit Line',
    defaultMessage: 'Credit Line',
  },
});

const artworkTechniqueVocabulary = [
  { value: 'oil_painting', label: 'Oil Painting' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'acrylic', label: 'Acrylic' },
  // ... other options
];

const AdvancedSearch = () => {
  const dispatch = useDispatch();
  const techniqueVocabulary = useSelector(
    (state) => state.vocabularies.techniqueVocabulary || [],
  );

  const [selectedTechnique, setSelectedTechnique] = useState(null);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        dispatch({ type: 'GET_VOCABULARY_REQUEST' }); // Set loading to true
        const response = await getVocabulary(
          'plone.app.vocabularies.artwork_technique',
        );
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'GET_VOCABULARY_SUCCESS', payload: data });
        } else {
          dispatch({ type: 'GET_VOCABULARY_FAILURE', error: 'Not Found' });
        }
      } catch (error) {
        dispatch({ type: 'GET_VOCABULARY_FAILURE', error: error.message });
      }
    };

    fetchVocabulary();
  }, [dispatch]);

  const [searchParams, setSearchParams] = useState({
    artwork_author: '',
    artwork_material: '',
    artwork_technique: '',
    ObjObjectNumberTxt: '',
    ObjTitleTxt: '',
    ObjObjectTypeTxt: '',
    ObjCreditlineTxt: '',
  });
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSubmit = () => {
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v.trim() !== ''),
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    history.push(`/search?${queryString}`);
  };

  const handleSelectChange = (option) => {
    setSelectedTechnique(option);
  };

  return (
    <div>
      {' '}
      <h1 class="documentFirstHeading">Geavanceerd zoeken</h1>
      <Container id="search-page">
        <div className="text-input-facet first">
          <Input
            type="text"
            name="SearchableText"
            value={searchParams.SearchableText}
            onChange={handleInputChange}
            placeholder="Zoeken"
          />
        </div>

        <div className="text-input-facet">
          <Header as="h4">Vervaardiger</Header>
          <Input
            type="text"
            name="artwork_author"
            value={searchParams.artwork_author}
            onChange={handleInputChange}
          />
        </div>
        <div className="text-input-facet">
          <Header as="h4">Titel</Header>
          <Input
            type="text"
            name="ObjTitleTxt"
            value={searchParams.ObjTitleTxt}
            onChange={handleInputChange}
          />
        </div>

        {/* <div className="text-input-facet">
          <Header as="h4">Objectnaam</Header>
          <Input
            type="text"
            name="ObjObjectTypeTxt"
            value={searchParams.ObjObjectTypeTxt}
            onChange={handleInputChange}
          />
        </div> */}

        <SelectFacet
          facet={{
            title: 'Objectnaam',
            field: { value: 'artwork_technique' }, // the name of the field in the searchParams
            multiple: false, // set to true if you want a multi-select
          }}
          choices={artworkTechniqueVocabulary}
          onChange={handleSelectChange}
          value={selectedTechnique}
        />

        {/* <div className="text-input-facet">
          <Header as="h4">Materiaal</Header>
          <Input
            type="text"
            name="artwork_material"
            value={searchParams.artwork_material}
            onChange={handleInputChange}
          />
        </div> */}

        <SelectFacet
          facet={{
            title: 'Materiaal',
            field: { value: 'artwork_technique' }, // the name of the field in the searchParams
            multiple: false, // set to true if you want a multi-select
          }}
          choices={artworkTechniqueVocabulary}
          onChange={handleSelectChange}
          value={selectedTechnique}
        />

        {/* <div className="text-input-facet">
        <Header as="h4">Artwork Technique</Header>
        <Input
          type="text"
          name="artwork_technique"
          value={searchParams.artwork_technique}
          onChange={handleInputChange}
          placeholder="Artwork's Technique..."
        />
      </div> */}
        <SelectFacet
          facet={{
            title: 'Techniek',
            field: { value: 'artwork_technique' }, // the name of the field in the searchParams
            multiple: false, // set to true if you want a multi-select
          }}
          choices={artworkTechniqueVocabulary}
          onChange={handleSelectChange}
          value={selectedTechnique}
        />

        <div className="text-input-facet">
          <Header as="h4">Credit Line</Header>
          <Input
            type="text"
            name="ObjCreditlineTxt"
            value={searchParams.ObjCreditlineTxt}
            onChange={handleInputChange}
          />
        </div>

        <div className="text-input-facet">
          <Header as="h4">Objectnummer</Header>
          <Input
            type="text"
            name="ObjObjectNumberTxt"
            value={searchParams.ObjObjectNumberTxt}
            onChange={handleInputChange}
          />
        </div>

        <button
          style={{ pointerEvents: 'auto' }}
          onClick={handleSubmit}
          type="submit"
          className="Search-main-button"
        >
          Zoeken
        </button>
      </Container>
    </div>
  );
};

export default AdvancedSearch;

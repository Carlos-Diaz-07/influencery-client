import { useState, useEffect } from "react";
import InfluencerCard from "./Card";
import styled from "styled-components";


const InfluencerSearch = () => {
  const [influencers, setInfluencers] = useState(null);
  const [platformString, setPlatformString] = useState("");
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [searchByString, setSearchByString] = useState("");



  useEffect(() => {
    getInfluencers();
  }, []);

  const getInfluencers = () =>
    fetch("http://localhost:3000/api/v1/influencers", {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setInfluencers(data))

  // This is to filter influencers by the text input & needs to be passed on
  // and array of influencers already filtered by the platform filter if you want
  // them to work together
  const searchInputFilter = (searchInput, searchBy, filteredByPlatform) => {
    if (searchInput !== undefined) {
      switch (searchBy) {
        case "handle":
          return filteredByPlatform.filter((influencer) => {
            return influencer.handle.toLowerCase().includes(searchInput.toLowerCase());
          });
        case "tag":
          return filteredByPlatform.filter((influencer) => {
            return influencer.tags.some((tag) => tag.name.includes(searchInput.toLowerCase()));
          });
        default:
          break;
      }
    } else {
      return filteredByPlatform
    }
  }

  // This is to filter by platform, only needs the platform you want to filter by
  // and filters all the influcers available from the API
  const platformFilter = (platform) => {
    const platformFilter = influencers.filter((influencer) => {
      return ((platform === "all") ? influencers : influencer.platform.name.includes(platform));
    });
    return platformFilter
  }

  // This controls and connects the filters so they work together, it also centralize the onChange events
  const dataFilter = ({ searchBy = searchByString, searchInput = searchString, platform = platformString }) => {
    setSearchByString(searchBy)
    setPlatformString(platform);
    setSearchString(searchInput);
    setFilteredInfluencers(searchInputFilter(searchInput, searchBy, platformFilter(platform)))
  }




  if (!influencers) {
    return (<Loader />)
  } else
    return (
      <div>
        <SearchInputContainer>
          <SelectInput
            value={searchByString}
            onChange={(e) => dataFilter({ searchBy: e.target.value })}
            name="searchBy"
            id="searchBy"
          >
            <option value="handle">By Handle</option>
            <option value="tag">By Tag</option>
          </SelectInput>
          <SearchInput
            placeholder="Enter influencer handle, platform, or tag"
            type="text"
            value={searchString}
            onChange={(e) => dataFilter({ searchInput: e.target.value })}
          />
          <SelectInput
            value={platformString}
            onChange={(e) => dataFilter({ platform: e.target.value })}
            name="platforms"
            id="platforms"
          >
            <option value="all">All</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">Tik-Tok</option>
            <option value="youtube">Youtube</option>
          </SelectInput>
        </SearchInputContainer>
        <SearchContainer>
          {!influencers && <Loader />}
          <div>
            {(filteredInfluencers.length === 0 ? influencers : filteredInfluencers).map((inf, i) => (
              <InfluencerCard influencer={inf} key={"inf_card_" + i} />
            ))}
          </div>
        </SearchContainer>
      </div>
    );
};

const SelectInput = styled.select`
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  border: 2px solid #2d9fd9;
  color: grey;
  width: 100px;
  height: 35px;
  padding-left: 10px;
  &:focus {
    outline: none;
    border: 2px solid #ee7622;
    color: grey;
  }
  margin: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 20vw 30px 20vw;
`;

const Loader = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: loader-spin 2s linear infinite;
  position: absolute;
  top: 45vh;
`;

const SearchInput = styled.input`
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  border: 2px solid #2d9fd9;
  color: grey;
  width: 300px;
  height: 30px;
  padding-left: 20px;
  &:focus {
    outline: none;
    border: 2px solid #ee7622;
    color: grey;
  }
  margin: 10px;
`;

const SearchInputContainer = styled.div`
  width: 100%;
  position: fixed;
  background-color: #f2f2f2;
  z-index: 1000;
`;

export default InfluencerSearch;

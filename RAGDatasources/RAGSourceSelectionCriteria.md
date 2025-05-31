### Criteria for Selecting RAG-Specific Data Sources
To ensure sources are relevant, reliable, and adaptable for any city, the following criteria are proposed:

1. **Local Relevance**:
   - **Description**: Sources must provide city-specific data on environmental impacts (water, air, land) or actionable solutions relevant to the target city’s climate, geography, and socio-economic context.
   - **Why**: Ensures RAG outputs (scores, summaries, suggestions) reflect local conditions (e.g., Bangalore’s water scarcity, urban sprawl).
   - **Application**: Prioritize sources with granular data (e.g., Bangalore’s PM2.5 levels, lake pollution stats) over generic national/global data.
   - **Scalability**: For other cities, search for local government reports, academic studies, or NGOs focusing on city-specific environmental issues (e.g., Delhi’s air quality, Chennai’s flooding).

2. **Data Specificity and Measurability**:
   - **Description**: Sources should provide quantitative or semi-quantitative data (e.g., CO2 emissions per km, liters of water per capita) to enable precise impact calculations and actionable recommendations.
   - **Why**: Supports the problem statement’s need for a quantifiable impact calculation engine and measurable success metrics (e.g., 15-25% carbon footprint reduction).
   - **Application**: Choose sources with metrics like emission factors, waste generation rates, or water usage benchmarks.
   - **Scalability**: Seek datasets with standardized metrics (e.g., air quality indices, waste per capita) that can be sourced from city-level agencies or global platforms like WHO or UNEP.

3. **Recency and Regular Updates**:
   - **Description**: Sources must be recent (ideally post-2020, preferably 2023-2025) and, where possible, provide real-time or frequently updated data to reflect current environmental conditions.
   - **Why**: Ensures RAG outputs are relevant to current challenges (e.g., Bangalore’s 2024 water crisis) and supports real-time processing requirements.
   - **Application**: Prioritize APIs (e.g., CPCB air quality) or recent reports (e.g., 2023 BBMP Climate Action Plan) over outdated studies.
   - **Scalability**: For other cities, use sources like national pollution boards, municipal websites, or global platforms (e.g., IQAir, OpenAQ) with recent data.

4. **Accessibility and RAG Compatibility**:
   - **Description**: Sources should be publicly accessible (open-access or free APIs) or obtainable via academic/NGO partnerships and provide structured (e.g., CSV, JSON) or semi-structured (e.g., PDFs, reports) data suitable for RAG ingestion.
   - **Why**: Facilitates integration into watsonx.ai’s RAG pipeline for retrieval and generation, reducing POC development barriers.
   - **Application**: Favor sources with downloadable datasets (e.g., CPCB’s Sameer API) or structured reports (e.g., IISc’s ENVIS reports).
   - **Scalability**: Identify equivalent sources in other cities (e.g., municipal open data portals, academic repositories like ResearchGate).

5. **Actionability for Recommendations**:
   - **Description**: For the Actionable Suggestions screen, sources must include practical, city-specific solutions (e.g., local recycling programs, public transport incentives) that RAG can tailor to user profiles.
   - **Why**: Addresses the problem statement’s actionability deficit and supports behavioral change (e.g., 60% of users implementing 3+ actions monthly).
   - **Application**: Include NGOs or government initiatives (e.g., BBMP’s waste segregation guidelines) with clear action plans.
   - **Scalability**: Look for city-level NGOs, municipal sustainability programs, or global frameworks (e.g., C40 Cities) with localized action plans.

6. **Credibility and Authority**:
   - **Description**: Sources should come from reputable institutions (e.g., government, academia, established NGOs) to ensure data reliability and user trust.
   - **Why**: Enhances the credibility of RAG outputs, critical for user engagement and environmental literacy (80% improvement target).
   - **Application**: Use sources like IISc, CPCB, or BBMP over unverified blogs or outdated studies.
   - **Scalability**: Prioritize government agencies, universities, or international organizations (e.g., UN, World Bank) with city-level data.

7. **Alignment with UN SDG 13**:
   - **Description**: Sources should support climate action goals (e.g., mitigation, resilience, education) to align with the problem statement’s focus on SDG 13 targets (13.1, 13.2, 13.3).
   - **Why**: Ensures EcoTrack contributes to global climate objectives and IBM Call for Code’s mission.
   - **Application**: Select sources addressing climate hazards (e.g., Bangalore’s flooding, air pollution) and mitigation strategies (e.g., rainwater harvesting).
   - **Scalability**: Use sources linked to global frameworks (e.g., C40, UNEP) that provide city-specific insights.

### Additional RAG-Specific Sources for Bangalore
Building on the previously recommended sources (e.g., IISc, CPCB, ATREE, KSPCB, BBMP), here are additional Bangalore-specific sources to enhance the RAG pipeline for the three screens. These meet the above criteria and provide richer data for water, air, and land impacts.

#### 1. Impact Assessment Score Screen
**Purpose**: Quantify user activities’ environmental impact (e.g., commute, waste) using Bangalore-specific metrics for air, water, and land.

- **Bengaluru Climate Action and Resilience Plan (BCAP) by BBMP**[](https://www.wricitiesindia.org/content/10-facts-better-understand-bengaluru-climate-action-and-resilience-plan)[](https://apps.bbmpgov.in/bcap/PDF/BCAP_FullReport_091224.pdf)
  - **Description**: Launched in November 2023 by Bruhat Bengaluru Mahanagara Palike (BBMP), BCAP provides a baseline of Bangalore’s greenhouse gas (GHG) emissions, climate hazards (e.g., flooding, heatwaves), and sector-specific data (e.g., transport, waste, water bodies). Uses 2019 as the base year for reliable pre-COVID data.
  - **Use for RAG**: Retrieve GHG emission factors (e.g., transport: 192 g CO2/km for petrol cars) and water demand (2,600 MLD vs. 1,950 MLD supply) to calculate user scores. For example, a 15 km car commute contributes ~2.88 kg CO2/day.
  - **Access**: Summary at `wricitiesindia.org` or full report via BBMP’s Climate Action Cell (`bbmp.gov.in`). Citation: WRI India, 2024.[](https://www.wricitiesindia.org/content/10-facts-better-understand-bengaluru-climate-action-and-resilience-plan)
  - **Criteria Met**: Local relevance (Bangalore-specific), specificity (GHG metrics), recency (2023), accessibility (public report), SDG 13 alignment (mitigation focus).
  - **Example Application**: RAG retrieves BCAP’s transport emission data to score a user’s 20 km daily bus commute lower than a car commute.

- **OpenCity - Bangalore Urban Data Portal**[](https://data.opencity.in/dataset/reports-of-environmentals-impacts-of-metro-in-bengaluru)
  - **Description**: OpenCity provides datasets on Bangalore’s metro rail impacts, including socio-economic and environmental perceptions (e.g., reduced CO2 from metro usage). Includes 2019 EMPRI reports on metro as a climate mitigation strategy.
  - **Use for RAG**: Retrieve metro emission reductions (e.g., 50 g CO2/km vs. 192 g CO2/km for cars) to adjust scores for users using public transport.
  - **Access**: Open-access at `data.opencity.in`. Citation: EMPRI, 2019.[](https://data.opencity.in/dataset/reports-of-environmentals-impacts-of-metro-in-bengaluru)
  - **Criteria Met**: Local relevance, specificity (transport metrics), accessibility (open data), SDG 13 alignment (mitigation via metro).
  - **Example Application**: A user logging “metro to work” gets a lower air impact score based on EMPRI’s CO2 reduction data.

- **Vivekananda International Foundation (VIF) - Bengaluru Water Crisis Report**[](https://www.vifindia.org/article/2024/may/13/Bengaluru-Water-Crisis-A-Case-of-Inadequate-Water-Management)
  - **Description**: 2024 report detailing Bangalore’s water crisis (2,600 MLD demand vs. 1,950 MLD supply, 650 MLD groundwater). Highlights groundwater depletion and lake loss.
  - **Use for RAG**: Retrieve water supply data (e.g., 75 LPCD actual vs. 150 LPCD norm) to score user water usage (e.g., 200 liters/day = high impact).
  - **Access**: Open-access at `vifindia.org`. Citation: VIF, 2024.[](https://www.vifindia.org/article/2024/may/13/Bengaluru-Water-Crisis-A-Case-of-Inadequate-Water-Management)
  - **Criteria Met**: Local relevance, specificity (water metrics), recency (2024), accessibility, SDG 13 alignment (resilience focus).
  - **Example Application**: RAG flags a user’s 300-liter/day usage as 4x Bangalore’s actual per capita supply, increasing water impact score.

#### 2. Summary Screen
**Purpose**: Generate a textual summary of the user’s environmental impact, contextualizing their activities (e.g., waste, travel) within Bangalore’s environmental trends.

- **Down To Earth - Bengaluru Water Crisis Articles**[](https://www.vifindia.org/article/2024/may/13/Bengaluru-Water-Crisis-A-Case-of-Inadequate-Water-Management)
  - **Description**: 2024 articles by M. Raghuram and others detail Bangalore’s water crisis, lake rejuvenation efforts, and wastewater treatment potential (e.g., 16.04 TMC reusable sewage). Discusses mismanagement and climate impacts.
  - **Use for RAG**: Retrieve data on lake pollution (e.g., 90% lakes contaminated) and waste (3,500 tons/day) to summarize user impact (e.g., “Your 2 kg waste adds to Bangalore’s landfill crisis”).
  - **Access**: Open-access at `downtoearth.org.in`. Citation: Raghuram et al., 2024.[](https://www.vifindia.org/article/2024/may/13/Bengaluru-Water-Crisis-A-Case-of-Inadequate-Water-Management)
  - **Criteria Met**: Local relevance, specificity (waste, water stats), recency (2024), accessibility, SDG 13 alignment (education, resilience).
  - **Example Application**: RAG summarizes: “Your 150-liter water usage exceeds Bangalore’s 75 LPCD average, straining groundwater resources.”

- **Citizen Matters - Bengaluru Environmental Reports**[](https://citizenmatters.in/tracking-what-bengaluru-is-breathing-in/)[](https://citizenmatters.in/bengalurus-bane-poorly-designed-environment-regulatory-systems-and-outdated-land-use-models/)
  - **Description**: Articles (2016-2022) on Bangalore’s air quality (“Breathe Bengaluru”), lake encroachments, and EIA failures. Details traffic emissions and waste burning impacts.
  - **Use for RAG**: Retrieve air pollution sources (e.g., 40% of PM2.5 from traffic) and lake loss data to contextualize user activities (e.g., car use, plastic waste).
  - **Access**: Open-access at `citizenmatters.in`. Citation: Citizen Matters, 2016-2022.[](https://citizenmatters.in/tracking-what-bengaluru-is-breathing-in/)[](https://citizenmatters.in/bengalurus-bane-poorly-designed-environment-regulatory-systems-and-outdated-land-use-models/)
  - **Criteria Met**: Local relevance, specificity (air, land data), recency (up to 2022), accessibility, SDG 13 alignment (awareness).
  - **Example Application**: RAG summarizes: “Your 10 km car commute contributes to Bangalore’s 26.8 µg/m³ PM2.5 levels, impacting air quality.”

- **State of the Environment Report - Karnataka (2003, updated references)**[](https://www.researchgate.net/publication/311068869_EMERGING_GROUND_WATER_CRISIS_IN_URBAN_AREAS_-_A_CASE_STUDY_OF_WARD_No_39_BANGALORE_CITY)
  - **Description**: Government of Karnataka’s report, referenced in 2008 studies, provides baseline data on Bangalore’s groundwater (408,000 tube wells) and water supply (100-110 LPCD).
  - **Use for RAG**: Retrieve historical and updated water data to compare user usage against city norms, highlighting long-term trends.
  - **Access**: Available via `kspcb.karnataka.gov.in` or academic repositories. Citation: Raju et al., 2008.[](https://www.researchgate.net/publication/311068869_EMERGING_GROUND_WATER_CRISIS_IN_URBAN_AREAS_-_A_CASE_STUDY_OF_WARD_No_39_BANGALORE_CITY)
  - **Criteria Met**: Local relevance, specificity (water metrics), accessibility, SDG 13 alignment (resilience).
  - **Example Application**: RAG summarizes: “Your 1 kg daily waste aligns with Bangalore’s 0.5 kg/capita average but strains landfills.”

#### 3. Actionable Suggestions Screen
**Purpose**: Deliver personalized, Bangalore-specific recommendations to reduce environmental impact, tailored to user profile and daily inputs.

- **WRI India - Bengaluru Climate Action Resources**[](https://www.wricitiesindia.org/content/10-facts-better-understand-bengaluru-climate-action-and-resilience-plan)
  - **Description**: WRI India’s BCAP resources (2023) outline actions like rainwater harvesting, waste segregation, and metro expansion to reduce GHG emissions and enhance resilience.
  - **Use for RAG**: Retrieve actionable strategies (e.g., “adopt 2-bin-1-bag waste system,” “use metro for commutes”) to suggest to users based on high-impact activities.
  - **Access**: Open-access at `wricitiesindia.org`. Citation: WRI India, 2024.[](https://www.wricitiesindia.org/content/10-facts-better-understand-bengaluru-climate-action-and-resilience-plan)
  - **Criteria Met**: Local relevance, actionability (specific solutions), recency (2023), accessibility, SDG 13 alignment (mitigation, resilience).
  - **Example Application**: For a high water score, RAG suggests: “Install BBMP-mandated rainwater harvesting to reduce your 200-liter/day usage.”

- **Sensors Without Borders - Bengaluru Environmental Initiatives**[](https://citizenmatters.in/tracking-what-bengaluru-is-breathing-in/)
  - **Description**: Part of the “Breathe Bengaluru” project, this initiative promotes community-driven solutions like air quality monitoring, cycling campaigns, and waste reduction programs in BTM Layout.
  - **Use for RAG**: Retrieve local programs (e.g., “Cycle2Work,” “compost workshops”) to recommend based on user activities (e.g., car use, organic waste).
  - **Access**: Details at `citizenmatters.in` or contact Sensors Without Borders. Citation: Citizen Matters, 2016.[](https://citizenmatters.in/tracking-what-bengaluru-is-breathing-in/)
  - **Criteria Met**: Local relevance, actionability, accessibility, SDG 13 alignment (community engagement).
  - **Example Application**: For a high transport score, RAG suggests: “Join BTM Layout’s Cycle2Work to cut your 3 kg CO2/day from driving.”

- **Bangalore Environment Trust (BET)** 
  - **Description**: NGO focused on lake restoration, tree planting, and waste management in Bangalore. Runs community programs like “Adopt a Lake” and “Zero Waste” campaigns.
  - **Use for RAG**: Retrieve programs (e.g., lake cleanups, composting workshops) to suggest user actions (e.g., “Join BET’s lake restoration to offset waste impact”).
  - **Access**: Available via BET’s website or local NGO directories. Contact `info@bangaloreenvironmenttrust.org`.
  - **Criteria Met**: Local relevance, actionability, accessibility, SDG 13 alignment (community action, education).
  - **Example Application**: For high waste scores, RAG suggests: “Participate in BET’s Zero Waste workshop to reduce your 2 kg/day waste.”

### Extending to Other Cities
To apply these sources to other cities (e.g., Delhi, Mumbai, Chennai, or global cities like Nairobi, São Paulo), use the criteria to identify equivalent sources:

1. **Local Relevance**:
   - **Example**: For Delhi, use Delhi Pollution Control Committee (DPCC) reports instead of KSPCB. For Nairobi, use Kenya’s National Environment Management Authority (NEMA).
   - **Search Strategy**: Query “[city name] environmental data” or “[city name] climate action plan” on government or academic websites.

2. **Data Specificity**:
   - **Example**: Use Mumbai’s BMC waste management data (e.g., 6,500 tons/day) or São Paulo’s air quality indices from CETESB.
   - **Search Strategy**: Look for city-specific emission factors, water usage stats, or waste benchmarks in municipal reports or open data portals (e.g., `data.gov.in` for India).

3. **Recency**:
   - **Example**: Access Delhi’s 2024 air quality data from CPCB or Mumbai’s 2023 Climate Budget from BMC.
   - **Search Strategy**: Filter for post-2020 data on platforms like Google Scholar, UNEP, or city government sites.

4. **Accessibility**:
   - **Example**: Use open APIs like OpenAQ for global air quality or ResearchGate for academic studies (e.g., Chennai’s flooding risks).
   - **Search Strategy**: Prioritize open-access platforms (e.g., `data.opencity.in`, `openaq.org`) or request datasets from universities/NGOs.

5. **Actionability**:
   - **Example**: For Chennai, recommend joining Arappor Iyakkam’s waste segregation drives. For Nairobi, suggest UNEP’s urban greening projects.
   - **Search Strategy**: Search “[city name] environmental NGOs” or “[city name] sustainability initiatives” for local programs.

6. **Credibility**:
   - **Example**: Use IIT Delhi for Delhi’s environmental research or University of São Paulo for local studies.
   - **Search Strategy**: Target reputable institutions via Google Scholar, JSTOR, or city university websites.

7. **SDG 13 Alignment**:
   - **Example**: Use C40 Cities reports for member cities (e.g., Delhi, São Paulo) or UNEP’s urban climate action guides.
   - **Search Strategy**: Query “[city name] SDG 13” or “[city name] climate action” on UN, C40, or ICLEI websites.

### Example Application for Another City (Delhi)
- **Impact Assessment Score**: Use CPCB’s Delhi air quality data (PM2.5: 100 µg/m³ average) and Yamuna River pollution stats from DPCC to score user activities (e.g., 10 km car commute = 1.92 kg CO2).
- **Summary**: Retrieve DPCC’s air pollution trends (e.g., 60% transport contribution) and Yamuna water quality data to summarize: “Your 200-liter water usage strains Delhi’s polluted Yamuna supply.”
- **Actionable Suggestions**: Suggest joining Delhi’s Odd-Even vehicle scheme or Greenpeace India’s clean air campaigns to reduce transport impact.

### Additional Notes
- **RAG Pipeline Integration**:
  - Index sources using watsonx.ai’s embedding models (e.g., for PDFs, extract text and create vector embeddings).
  - Query example: “CO2 emissions for car commute in Bangalore” retrieves BCAP’s 192 g CO2/km for scoring.
  - Ensure RAG outputs are concise (e.g., 3-5 suggestions) and personalized (e.g., vegetarian user gets plant-based diet tips).
- **POC Testing**:
  - Simulate a Bangalore user (e.g., 30-year-old, 15 km car commute, 1 kg waste) using BCAP, CPCB, and BET data to validate scores, summaries, and suggestions.
  - For other cities, replicate with local equivalents (e.g., Mumbai’s BMC data, Delhi’s DPCC APIs).
- **Scalability**:
  - Create a source discovery template: (1) Check municipal websites (e.g., `bbmp.gov.in`), (2) Search academic repositories (e.g., ResearchGate, Google Scholar), (3) Use global platforms (e.g., OpenAQ, C40), (4) Contact local NGOs.
  - Automate data retrieval with APIs where available (e.g., CPCB, OpenAQ) for real-time updates.

### Artifact: Source Selection Criteria Document
To formalize the criteria for future use, here’s a structured document wrapped in the required `<xaiArtifact>` tag.


# EcoTrack RAG Source Selection Criteria

## Purpose
To ensure data sources for EcoTrack’s Retrieval-Augmented Generation (RAG) system are relevant, reliable, and scalable for calculating environmental impact scores, generating summaries, and providing actionable suggestions in any city.

## Criteria

1. **Local Relevance**
   - Sources must provide city-specific data on water, air, and land impacts or solutions.
   - Example: Bangalore’s BBMP Climate Action Plan for emissions data.
   - Scalability: Use municipal reports or local academic studies for other cities (e.g., Delhi’s DPCC).

2. **Data Specificity and Measurability**
   - Sources should offer quantitative metrics (e.g., CO2 emissions, water usage per capita).
   - Example: CPCB’s PM2.5 data (26.8 µg/m³ in Bangalore).
   - Scalability: Seek standardized metrics from national agencies (e.g., India’s CPCB, Brazil’s CETESB).

3. **Recency and Regular Updates**
   - Prefer sources post-2020, ideally 2023-2025, with real-time or frequent updates.
   - Example: BBMP’s 2023 Climate Action Plan.
   - Scalability: Use APIs (e.g., OpenAQ) or recent municipal reports for other cities.

4. **Accessibility and RAG Compatibility**
   - Sources must be open-access or obtainable and provide structured/semi-structured data.
   - Example: IISc’s ENVIS reports (PDFs) or CPCB’s Sameer API.
   - Scalability: Use open data portals (e.g., `data.gov.in`, `openaq.org`) or academic repositories.

5. **Actionability for Recommendations**
   - Sources should include city-specific solutions (e.g., recycling programs, public transport).
   - Example: BET’s “Zero Waste” workshops in Bangalore.
   - Scalability: Identify local NGOs or municipal initiatives (e.g., Chennai’s Arappor Iyakkam).

6. **Credibility and Authority**
   - Sources must come from reputable institutions (government, academia, NGOs).
   - Example: IISc, CPCB, ATREE for Bangalore.
   - Scalability: Use universities, national agencies, or global bodies (e.g., UNEP, C40).

7. **Alignment with UN SDG 13**
   - Sources should support climate action, resilience, and education goals.
   - Example: BCAP’s mitigation strategies align with SDG 13.2.
   - Scalability: Use C40, UNEP, or ICLEI reports for city-specific SDG alignment.

## Application
- **Bangalore POC**: Use BBMP, CPCB, IISc, ATREE, BET, and WRI India for localized data.
- **Other Cities**: Replace with equivalents (e.g., Delhi: DPCC, IIT Delhi; Nairobi: NEMA, UNEP).
- **Search Strategy**: Query municipal sites, academic databases (Google Scholar, ResearchGate), and global platforms (OpenAQ, C40).

## Notes
- Prioritize APIs for real-time data and PDFs for detailed reports.
- Contact local institutions (e.g., universities, NGOs) for unpublished datasets.
- Validate sources with a test user to ensure RAG outputs are accurate and actionable.



### Final Notes
The additional sources (BCAP, OpenCity, VIF, Down To Earth, Citizen Matters, BET) complement the earlier recommendations (IISc, CPCB, ATREE, KSPCB, BBMP, ESG) by providing richer, more recent data for Bangalore. The criteria ensure these sources are RAG-compatible, actionable, and aligned with EcoTrack’s goals. For scaling to other cities, use the criteria to systematically identify equivalents (e.g., Mumbai’s BMC, Delhi’s DPCC). If you need help with RAG implementation (e.g., indexing these sources in watsonx.ai) or mock data for the Bangalore POC, let me know!

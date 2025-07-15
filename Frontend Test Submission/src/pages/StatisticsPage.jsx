import React from 'react';
import Statistics from '../components/statistics.jsx';
import { useParams } from 'react-router-dom';

const StatisticsPage = () => {

    const {shortCode} = useParams();
    
    return (
        <div>
            <Statistics shortCode={shortCode} />
        </div>
    );
}

export default Statistics;

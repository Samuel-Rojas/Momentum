import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  List,
  ListItem,
  ListIcon,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { useAuth } from '../utils/AuthContext';
import { analyzeProductivity, getProductivityRecommendations, ProductivityData } from '../utils/productivityService';
import { RiTimeLine, RiCalendarLine, RiLightbulbLine, RiCheckLine } from 'react-icons/ri';

const ProductivityInsights: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ProductivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const productivityData = await analyzeProductivity(user.uid);
        setData(productivityData);
      } catch (err) {
        setError('Failed to load productivity data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={4}>
        <Text color={mutedColor}>No productivity data available yet.</Text>
      </Box>
    );
  }

  const recommendations = getProductivityRecommendations(data);
  const avgHours = data.averageCompletionTime / (1000 * 60 * 60);

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" color={textColor}>Productivity Insights</Heading>

      <StatGroup>
        <Stat
          bg={bgColor}
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <StatLabel color={textColor}>Most Productive Hour</StatLabel>
          <StatNumber color={textColor}>
            {data.mostProductiveHour}:00
          </StatNumber>
          <StatHelpText color={mutedColor}>
            {data.mostProductiveHour >= 12 ? 'PM' : 'AM'}
          </StatHelpText>
        </Stat>

        <Stat
          bg={bgColor}
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <StatLabel color={textColor}>Most Productive Day</StatLabel>
          <StatNumber color={textColor}>
            {data.mostProductiveDay}
          </StatNumber>
          <StatHelpText color={mutedColor}>
            Based on task completion
          </StatHelpText>
        </Stat>

        <Stat
          bg={bgColor}
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <StatLabel color={textColor}>Avg. Completion Time</StatLabel>
          <StatNumber color={textColor}>
            {avgHours.toFixed(1)}h
          </StatNumber>
          <StatHelpText color={mutedColor}>
            Per task
          </StatHelpText>
        </Stat>
      </StatGroup>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="md" color={textColor}>
                <Icon as={RiTimeLine} mr={2} />
                Hourly Productivity
              </Heading>
              <List spacing={2}>
                {Object.entries(data.completionRateByHour)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([hour, rate]) => (
                    <ListItem key={hour} color={textColor}>
                      <ListIcon as={RiCheckLine} color="green.500" />
                      {parseInt(hour)}:00 - {(rate * 100).toFixed(1)}% completion rate
                    </ListItem>
                  ))}
              </List>
            </VStack>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="md" color={textColor}>
                <Icon as={RiCalendarLine} mr={2} />
                Daily Productivity
              </Heading>
              <List spacing={2}>
                {Object.entries(data.completionRateByDay)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([day, rate]) => (
                    <ListItem key={day} color={textColor}>
                      <ListIcon as={RiCheckLine} color="green.500" />
                      {day} - {(rate * 100).toFixed(1)}% completion rate
                    </ListItem>
                  ))}
              </List>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
        <CardBody>
          <VStack align="start" spacing={4}>
            <Heading size="md" color={textColor}>
              <Icon as={RiLightbulbLine} mr={2} />
              Personalized Recommendations
            </Heading>
            <List spacing={2}>
              {recommendations.map((recommendation, index) => (
                <ListItem key={index} color={textColor}>
                  <ListIcon as={RiCheckLine} color="blue.500" />
                  {recommendation}
                </ListItem>
              ))}
            </List>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default ProductivityInsights; 
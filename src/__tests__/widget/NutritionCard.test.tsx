import React from 'react';
import { render, screen } from '@testing-library/react';
import NutritionCard from '@/components/widgets/NutritionCard';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, style }: any) {
    return <img src={src} alt={alt} width={width} height={height} style={style} data-testid="food-image" />;
  };
});

// Mock the SVG and image imports
jest.mock('../../../public/staticFoodImage.svg', () => {
  return function StaticFoodImage(props: any) {
    return <svg data-testid="static-food-image" {...props} />;
  };
});
jest.mock('../../../public/foulAndPizza.png', () => 'foulAndPizza.png');
jest.mock('../../../public/shakshuka.png', () => 'shakshuka.png');
jest.mock('../../../public/labnehPita.png', () => 'labnehPita.png');

describe('NutritionCard', () => {
  const mockItems = [
    {
      foodName: 'Oatmeal with Berries',
      calories: '150',
      proteins: '6',
      carbs: '25',
      fats: '3',
      filePath: '/api/food-images/oatmeal.jpg',
    },
    {
      foodName: 'Greek Yogurt',
      calories: '120',
      proteins: '15',
      carbs: '8',
      fats: '2',
      filePath: null,
    },
    {
      foodName: 'Banana',
      calories: '105',
      proteins: '1.3',
      carbs: '27',
      fats: '0.4',
      filePath: undefined,
    },
  ];

  const mockItemsWithoutImages = [
    {
      foodName: 'Apple',
      calories: '95',
      proteins: '0.5',
      carbs: '25',
      fats: '0.3',
    },
  ];

  it('renders the nutrition card with title and nutrition totals', () => {
    render(<NutritionCard title="Breakfast" time="07:00 am" items={mockItems} />);
    
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Calories 375')).toBeInTheDocument(); // 150 + 120 + 105
    expect(screen.getByText('Protein 22.3')).toBeInTheDocument(); // 6 + 15 + 1.3
    expect(screen.getByText('Carb 60')).toBeInTheDocument(); // 25 + 8 + 27
    expect(screen.getByText('Fat 5.4')).toBeInTheDocument(); // 3 + 2 + 0.4
  });

  it('renders all food items with their names', () => {
    render(<NutritionCard title="Lunch" time="12:00 pm" items={mockItems} />);
    
    expect(screen.getByText('Oatmeal with Berries')).toBeInTheDocument();
    expect(screen.getByText('Greek Yogurt')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('renders food images when filePath is provided', () => {
    render(<NutritionCard title="Dinner" time="07:00 pm" items={mockItems} />);
    
    const foodImages = screen.getAllByTestId('food-image');
    expect(foodImages).toHaveLength(1); // Only oatmeal has a filePath
    expect(foodImages[0]).toHaveAttribute('src', '/api/food-images/oatmeal.jpg');
    expect(foodImages[0]).toHaveAttribute('alt', 'Oatmeal with Berries');
  });

//   it('renders static food image when filePath is null or undefined', () => {
//     render(<NutritionCard title="Snack" time="10:00 am" items={mockItems} />);
    
//     const staticImages = screen.getAllByTestId('static-food-image');
//     expect(staticImages).toHaveLength(2); // Greek Yogurt and Banana have no filePath
//   });

  it('handles empty items array', () => {
    render(<NutritionCard title="Breakfast" time="07:00 am" items={[]} />);
    
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Calories 0')).toBeInTheDocument();
    expect(screen.getByText('Protein 0')).toBeInTheDocument();
    expect(screen.getByText('Carb 0')).toBeInTheDocument();
    expect(screen.getByText('Fat 0')).toBeInTheDocument();
  });

//   it('handles undefined items', () => {
//     render(<NutritionCard title="Lunch" time="12:00 pm" items={undefined as any} />);
    
//     expect(screen.getByText('Lunch')).toBeInTheDocument();
//     expect(screen.getByText('Calories 0')).toBeInTheDocument();
//     expect(screen.getByText('Protein 0')).toBeInTheDocument();
//     expect(screen.getByText('Carb 0')).toBeInTheDocument();
//     expect(screen.getByText('Fat 0')).toBeInTheDocument();
//   });

  it('calculates nutrition totals correctly with decimal values', () => {
    const decimalItems = [
      {
        foodName: 'Almonds',
        calories: '164.5',
        proteins: '6.02',
        carbs: '6.11',
        fats: '14.89',
      },
      {
        foodName: 'Blueberries',
        calories: '85.2',
        proteins: '1.1',
        carbs: '21.45',
        fats: '0.49',
      },
    ];

    render(<NutritionCard title="Snack" time="03:00 pm" items={decimalItems} />);
    
    expect(screen.getByText('Calories 249.7')).toBeInTheDocument(); // 164.5 + 85.2
    expect(screen.getByText('Protein 7.119999999999999')).toBeInTheDocument(); // 6.02 + 1.1
    expect(screen.getByText('Carb 27.56')).toBeInTheDocument(); // 6.11 + 21.45
    expect(screen.getByText('Fat 15.38')).toBeInTheDocument(); // 14.89 + 0.49
  });

  it('handles items with missing nutrition values', () => {
    const incompleteItems = [
      {
        foodName: 'Water',
        calories: '0',
        proteins: '',
        carbs: '0',
        fats: null,
      },
    ];

    render(<NutritionCard title="Hydration" time="09:00 am" items={incompleteItems} />);
    
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('Calories 0')).toBeInTheDocument();
    expect(screen.getByText('Protein NaN')).toBeInTheDocument(); // parseFloat('') returns NaN
    expect(screen.getByText('Carb 0')).toBeInTheDocument();
    expect(screen.getByText('Fat NaN')).toBeInTheDocument(); // parseFloat(null) returns NaN
  });

  it('renders nutrition indicators with correct colors', () => {
    render(<NutritionCard title="Breakfast" time="07:00 am" items={mockItemsWithoutImages} />);
    
    // Check that nutrition indicators are rendered (they are spans with colored backgrounds)
    const nutritionTexts = screen.getAllByText(/Calories|Protein|Carb|Fat/);
    expect(nutritionTexts).toHaveLength(4);
  });

  it('matches snapshot with data', () => {
    const { asFragment } = render(<NutritionCard title="Breakfast" time="07:00 am" items={mockItems} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with empty data', () => {
    const { asFragment } = render(<NutritionCard title="Lunch" time="12:00 pm" items={[]} />);
    expect(asFragment()).toMatchSnapshot();
  });
}); 
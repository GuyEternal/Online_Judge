#include <iostream> 
#include <vector> 
using namespace std; 
 
vector<int> generateArrayRepresentation(long long number) { 
    vector<int> resultArray; 
    while (number > 0) { 
        if (number % 2 == 0) { 
            resultArray.push_back(0); 
            number /= 2; 
        } else { 
            if (number % 4 == 1) { 
                resultArray.push_back(1); 
                number = (number - 1) / 2; 
            } else { 
                resultArray.push_back(-1); 
                number = (number + 1) / 2; 
            } 
        } 
    } 
    return resultArray; 
} 
 
int main() { 
    int testCases; 
    cin >> testCases; 
    vector<vector<int>> allResults; 
 
    for (int i = 0; i < testCases; ++i) { 
        long long inputNumber; 
        cin >> inputNumber; 
        vector<int> currentResult = generateArrayRepresentation(inputNumber); 
        allResults.push_back(currentResult); 
    } 
 
    for (const auto& res : allResults) { 
        cout << res.size() << endl; 
        for (size_t i = 0; i < res.size(); ++i) { 
            if (i > 0) cout << " "; 
            cout << res[i]; 
        } 
        cout << endl; 
    } 
 
    return 0; 
}

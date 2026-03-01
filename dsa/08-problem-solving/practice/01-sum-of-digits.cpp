#include <iostream>

using namespace std;

int main()
{
    int i = 0;
    cout << "enter number: ";
    cin >> i;

    int sum = 0;
    while (i > 0)
    {
        sum += i % 10;
        i /= 10;
    }
    cout << sum << endl;
    return 0;
}
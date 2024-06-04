#include <bits/stdc++.h>
#define endl "\n"
#define ll long long
#define ull unsigned long long
#define vi vector<int>
#define vll vector<ll>
#define vvi vector<vi>
#define pii pair<int, int>
#define pll pair<ll, ll>
#define mod 1000000007
#define inf 1000000000000000001
#define all(c) c.begin(), c.end()
#define mem(a, val) memset(a, val, sizeof(a))
#define f first
#define s second

using namespace std;

ll computeOR(ll num, ll steps) {
    ll left = max(num - steps, 0LL);
    ll right = num + steps;

    if (steps == 0)
        return num;

    ull or_mask = 0;
    for (int bit = 64; bit >= 0; --bit) {
        if ((left & (1ULL << bit)) != (right & (1ULL << bit))) {
            or_mask = (1ULL << (bit + 1)) - 1;
            break;
        }
    }

    return right | or_mask;
}

void solve() {
    ll n, steps;
    cin >> n >> steps;
    cout << computeOR(n, steps) << endl;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    ll T = 1;
    cin >>T;
    while (T--) {
        solve();
    }
  while(true){
    T++;
    T--;
  }
    return 0;
}

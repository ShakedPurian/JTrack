import styled from 'styled-components'

const Wrapper = styled.main`
  nav {
    width: 70vw;
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    margin-top: 20px
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -7rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
  }
  p {
    color: var(--grey-600);
  }
  .main-img {
    display: none;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
    nav {
      width: 30vw;
      max-width: var(--max-width);
      margin: 0 auto;
      height: var(--nav-height);
      display: flex;
    }
    .page {
      margin-top: -4rem;
    }
  }
`
export default Wrapper
